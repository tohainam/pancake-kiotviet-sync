import { Injectable, Logger } from '@nestjs/common';
import { KiotvietService } from 'src/kiotviet/kiotviet.service';
import { PancakeService } from 'src/pancake/pancake.service';
import { StorageService } from 'src/storage/storage.service';
import { PancakeOrder } from 'src/types';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(
    private readonly storageService: StorageService,
    private readonly pancakeService: PancakeService,
    private readonly kiotvietService: KiotvietService,
  ) {}

  async handlePancakeOrdersWebhook(order: PancakeOrder) {
    try {
      this.logger.log(
        `[START] handlePancakeOrdersWebhook for order ID: ${order.id} with status: ${order.status}`,
      );

      if (order.status !== 7) {
        const invoiceId = await this.storageService.get<string>(
          'pancake_order_' + order.id,
        );

        this.logger.log(
          `[PROCESSING] handlePancakeOrdersWebhook for order ID: ${order.id} with status: ${order.status} with invoiceId: ${invoiceId}`,
        );

        const orderData = this.pancakeService.prepareData(order);

        if (!invoiceId) {
          if (order.status === 0) {
            await this.kiotvietService.createInvoice(orderData);
          }
        } else {
          await this.kiotvietService.updateInvoice(invoiceId, orderData);
        }
      }

      if (order.status === 7) {
        const invoiceId = await this.storageService.get<string>(
          'pancake_order_' + order.id,
        );
        this.logger.log(
          `[PROCESSING] handlePancakeOrdersWebhook for order ID: ${order.id} with status: ${order.status} with invoiceId: ${invoiceId}`,
        );

        if (invoiceId) {
          await this.kiotvietService.deleteInvoice(invoiceId);
          await this.storageService.del('pancake_order_' + order.id);
          // this.logger.log(
          //   `Order ID: ${order.id} has been deleted, removing from storage and KiotViet.`,
          // );
        }
      }

      this.logger.log(
        `[END] handlePancakeOrdersWebhook for order ID: ${order.id} with status: ${order.status}`,
      );
    } catch {
      this.logger.error(
        `[END] handlePancakeOrdersWebhook for order ID ${order.id} with status: ${order.status} webhook`,
      );
    }
  }
}
