import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { catchError, delay, firstValueFrom, map, of } from 'rxjs';
import { PAGE_MAP, STATUS_MAP, USER_FULLNAME_MAP } from 'src/common';
import { PancakeOrder } from 'src/types';

const access_token_cache_key = 'kiotviet_access_token';

@Injectable()
export class KiotvietService {
  private readonly logger = new Logger(KiotvietService.name);

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async createInvoice(
    data: Pick<
      PancakeOrder,
      | 'id'
      | 'status'
      | 'customer'
      | 'items'
      | 'total_price'
      | 'shipping_fee'
      | 'partner'
      | 'shipping_address'
      | 'creator'
      | 'page_id'
    >,
  ) {
    try {
      this.logger.log(
        `Creating invoice for Pancake order ID: ${data.id} with status: ${data.status} with data: ${JSON.stringify(data)}`,
      );

      const invoice: {
        branchId: number;
        isApplyVoucher: boolean;
        customerId?: number;
        discount?: number;
        totalPayment: number;
        saleChannelId?: number;
        accountId?: number;
        usingCod: boolean;
        soldById: number;
        orderId?: string;
        status: number;
        invoiceDetails: any[];
        deliveryDetail: any;
        description?: string;
      } = {
        branchId: 1000011751,
        isApplyVoucher: false,
        totalPayment: 0,
        saleChannelId: 1000015850, // Kênh facebook for kiotviet
        usingCod: true,
        soldById:
          data?.page_id && PAGE_MAP[data.page_id]
            ? Number(PAGE_MAP[data.page_id])
            : 1000029677, // admin
        status: 3, // Đang xử lý
        invoiceDetails: data.items.map((item) => {
          return {
            productCode: item.variation_info.product_display_id,
            quantity: item.quantity,
            price: item.variation_info.retail_price,
          };
        }),
        deliveryDetail: {
          Status: 1,
          Address: data.shipping_address.address,
          ContactNumber: data.shipping_address.phone_number,
          Receiver: data.shipping_address.full_name,
          BranchTakingAddressId: 1000011751,
          AddressInforDelivery: data.shipping_address.address,
          TotalProductPrice: data.total_price,
          TotalReceiverPay: data.total_price,
          UsingPriceCod: 1,
          Price: data.shipping_fee,
          DeliveryCode: data.partner?.extend_code || '',
          PartnerDeliveryId: 1000002676, // J&T
        },
        description: `Đơn hàng tự động tạo từ đơn Pancake with ID ${data.id}.${USER_FULLNAME_MAP[data.creator.fb_id] ? ` Tạo bởi ${USER_FULLNAME_MAP[data.creator.fb_id]}` : ''}`,
      };

      const RETAILER_NAME =
        this.configService.getOrThrow<string>('RETAILER_NAME');
      const INVOICE_ENDPOINT =
        this.configService.getOrThrow<string>('INVOICE_ENDPOINT');
      const CUSTOMER_ENDPOINT =
        this.configService.getOrThrow<string>('CUSTOMER_ENDPOINT');

      await firstValueFrom(await this.checkAccessTokenValid());

      const accessToken = await this.cacheManager.get<string>(
        access_token_cache_key,
      );

      const responseCustomer: {
        data: { total: number; data: { id: number }[] };
      } = await firstValueFrom(
        this.httpService
          .get(
            `${CUSTOMER_ENDPOINT}?contactNumber=${data.customer?.phone_numbers?.[0]}`,
            {
              headers: {
                Retailer: RETAILER_NAME,
                Authorization: `Bearer ${accessToken || ''}`,
              },
            },
          )
          .pipe(
            catchError((error: any) => {
              this.logger.error(error);
              throw new Error('Failed to fetch customer data');
            }),
          ),
      );

      let customerId: number;
      if (responseCustomer.data?.total === 0) {
        const response: { data: { data: { id: number } } } =
          await firstValueFrom(
            this.httpService
              .post(
                CUSTOMER_ENDPOINT,
                {
                  name: data.customer?.name,
                  contactNumber: data.customer?.phone_numbers?.[0],
                  branchId: 1000011751,
                },
                {
                  headers: {
                    Retailer: RETAILER_NAME,
                    Authorization: `Bearer ${accessToken || ''}`,
                  },
                },
              )
              .pipe(
                catchError((error: any) => {
                  if (
                    error &&
                    typeof error === 'object' &&
                    'response' in error
                  ) {
                    this.logger.error(
                      'Error:',
                      (
                        error as {
                          response?: { data?: { responseStatus?: any } };
                        }
                      ).response?.data?.responseStatus,
                    );
                  } else {
                    this.logger.error('Error:', error);
                  }
                  throw new Error('Failed to create customer');
                }),
              ),
          );
        customerId = response.data.data.id;
      } else {
        customerId = responseCustomer.data.data?.[0]?.id;
      }

      if (customerId) {
        invoice.customerId = customerId;
      }

      await firstValueFrom(
        this.httpService
          .post(INVOICE_ENDPOINT, invoice, {
            headers: {
              Retailer: RETAILER_NAME,
              Authorization: `Bearer ${accessToken || ''}`,
            },
          })
          .pipe(
            map(async (response) => {
              await this.cacheManager.set(
                'pancake_order_' + data.id,
                (response.data as { id: string | number }).id.toString(),
                604800000,
              );
              return response;
            }),
            catchError((error: any) => {
              if (error && typeof error === 'object' && 'response' in error) {
                this.logger.error(
                  'Error:',
                  (error as { response?: { data?: { responseStatus?: any } } })
                    .response?.data?.responseStatus,
                );
              } else {
                this.logger.error('Error:', error);
              }
              throw new Error('Failed to create invoice');
            }),
          ),
      );

      this.logger.log(
        `Created invoice for Pancake order ID: ${data.id} with status: ${data.status} with data: ${JSON.stringify(data)}`,
      );
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(
        `Error creating invoice for Pancake order ID: ${data.id} with status: ${data.status} with data: ${JSON.stringify(data)} with error: ${errorMessage}`,
      );
    }
  }

  async updateInvoice(
    invoiceId: string,
    data: Pick<
      PancakeOrder,
      | 'id'
      | 'status'
      | 'customer'
      | 'items'
      | 'total_price'
      | 'shipping_fee'
      | 'partner'
      | 'shipping_address'
      // | 'creator'
      | 'page_id'
    >,
  ) {
    try {
      this.logger.log(
        `Updating invoice for Pancake order ID: ${data.id} with status: ${data.status} with data: ${JSON.stringify(data)}`,
      );

      const invoice: {
        soldById: number;
        invoiceDetails: any[];
        deliveryDetail: {
          Status?: number;
          Address: string;
          ContactNumber: string;
          Receiver: string;
          AddressInforDelivery: string;
          TotalProductPrice: number;
          TotalReceiverPay: number;
          Price: number;
          DeliveryCode: string;
          PartnerDeliveryId: number;
        };
      } = {
        soldById:
          data?.page_id && PAGE_MAP[data.page_id]
            ? Number(PAGE_MAP[data.page_id])
            : 1000029677, // admin
        invoiceDetails: data.items.map((item) => {
          return {
            productCode: item.variation_info.product_display_id,
            quantity: item.quantity,
            price: item.variation_info.retail_price,
          };
        }),
        deliveryDetail: {
          Address: data.shipping_address.address,
          ContactNumber: data.shipping_address.phone_number,
          Receiver: data.shipping_address.full_name,
          AddressInforDelivery: data.shipping_address.address,
          TotalProductPrice: data.total_price,
          TotalReceiverPay: data.total_price,
          Price: data.shipping_fee,
          DeliveryCode: data.partner?.extend_code || '',
          PartnerDeliveryId: 1000002676,
        },
      };

      if (
        data.partner?.partner_status &&
        STATUS_MAP[data.partner?.partner_status]
      ) {
        invoice.deliveryDetail.Status = STATUS_MAP[data.partner.partner_status];
      }

      const RETAILER_NAME =
        this.configService.getOrThrow<string>('RETAILER_NAME');
      const INVOICE_ENDPOINT =
        this.configService.getOrThrow<string>('INVOICE_ENDPOINT');

      await firstValueFrom(await this.checkAccessTokenValid());

      const accessToken = await this.cacheManager.get<string>(
        access_token_cache_key,
      );

      await firstValueFrom(
        this.httpService
          .put(`${INVOICE_ENDPOINT}/${invoiceId}`, invoice, {
            headers: {
              Retailer: RETAILER_NAME,
              Authorization: `Bearer ${accessToken || ''}`,
            },
          })
          .pipe(
            map(async (response) => {
              await this.cacheManager.set(
                'pancake_order_' + data.id,
                (response.data as { id: string | number }).id.toString(),
                604800000,
              );
              return response;
            }),
            catchError((error: any) => {
              if (error && typeof error === 'object' && 'response' in error) {
                console.error(
                  'Error:',
                  (error as { response?: { data?: { responseStatus?: any } } })
                    .response?.data?.responseStatus,
                );
              } else {
                console.error('Error:', error);
              }
              throw new Error('Failed to update invoice');
            }),
          ),
      );
    } catch (error) {
      this.logger.error(
        `Error updating invoice for Pancake order ID: ${data.id} with status: ${data.status} with data: ${JSON.stringify(data)} with error: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  async deleteInvoice(invoiceId: string) {
    try {
      this.logger.log(`Deleting invoice with ID: ${invoiceId}`);

      const INVOICE_ENDPOINT =
        this.configService.getOrThrow<string>('INVOICE_ENDPOINT');
      const RETAILER_NAME =
        this.configService.getOrThrow<string>('RETAILER_NAME');

      await firstValueFrom(await this.checkAccessTokenValid());

      const accessToken = await this.cacheManager.get<string>(
        access_token_cache_key,
      );

      await firstValueFrom(
        this.httpService
          .delete(`${INVOICE_ENDPOINT}`, {
            headers: {
              Retailer: RETAILER_NAME,
              Authorization: `Bearer ${accessToken || ''}`,
            },
            data: {
              id: invoiceId,
              isVoidPayment: true,
            },
          })
          .pipe(
            catchError((error: any) => {
              this.logger.error(
                `Error deleting invoice with ID: ${invoiceId} with error: ${error instanceof Error ? error.message : String(error)}`,
              );
              throw new Error('Failed to delete invoice');
            }),
          ),
      );
      this.logger.log(`Deleted invoice with ID: ${invoiceId}`);
    } catch (error) {
      this.logger.error(
        `Error deleting invoice with ID: ${invoiceId} with error: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  getAccessToken() {
    this.logger.log('Fetching Kiotviet access token...');
    const TOKEN_ENDPOINT =
      this.configService.getOrThrow<string>('TOKEN_ENDPOINT');
    const CLIENT_ID = this.configService.getOrThrow<string>('CLIENT_ID');
    const CLIENT_SECRET =
      this.configService.getOrThrow<string>('CLIENT_SECRET');

    return this.httpService
      .post(
        TOKEN_ENDPOINT,
        {
          scopes: 'PublicApi.Access',
          grant_type: 'client_credentials',
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
        },
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: 'application/json',
          },
        },
      )
      .pipe(
        map(async (response) => {
          this.logger.log('Access token fetched successfully');
          const data = response.data as { access_token: string };
          const accessToken = data.access_token;
          await this.cacheManager.set(access_token_cache_key, accessToken);
          return response.data as Record<string, unknown>;
        }),
        catchError((error: any) => {
          if (error && typeof error === 'object' && 'response' in error) {
            console.error(
              'Error:',
              (error as { response?: { data?: any } }).response?.data,
            );
          } else {
            console.error('Error:', error);
          }
          throw new Error('Failed to get access token');
        }),
      );
  }

  async checkAccessTokenValid() {
    this.logger.log('Checking Kiotviet access token validity...');
    const WEBHOOK_ENDPOINT =
      this.configService.getOrThrow<string>('WEBHOOK_ENDPOINT');
    const RETAILER_NAME =
      this.configService.getOrThrow<string>('RETAILER_NAME');

    const accessToken = await this.cacheManager.get<string>(
      access_token_cache_key,
    );

    return this.httpService
      .get(WEBHOOK_ENDPOINT, {
        headers: {
          Retailer: RETAILER_NAME,
          Authorization: `Bearer ${accessToken || ''}`,
        },
      })
      .pipe(
        catchError((error: any) => {
          if (
            error &&
            typeof error === 'object' &&
            'status' in error &&
            typeof (error as { status?: unknown }).status === 'number' &&
            (error as { status: number }).status === 401
          ) {
            this.logger.log('Access token expired, refreshing...');
            return this.getAccessToken().pipe(
              delay(2000),
              map(() => null),
            );
          }

          return of(null);
        }),
      );
  }
}
