import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { KiotvietService } from 'src/kiotviet/kiotviet.service';
import { PancakeService } from 'src/pancake/pancake.service';
import { PancakeOrder } from 'src/types';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly pancakeService: PancakeService,
    private readonly kiotvietService: KiotvietService,
  ) {}

  async handlePancakeOrdersWebhook(order: PancakeOrder) {
    try {
      this.logger.log(
        `Processing Pancake order webhook for order ID: ${order.id} with status: ${order.status}`,
      );

      if (order.status !== 7) {
        const invoiceId = await this.cacheManager.get<string>(
          'pancake_order_' + order.id,
        );

        const orderData = this.pancakeService.prepareData(order);

        if (!invoiceId) {
          await this.kiotvietService.createInvoice(orderData);
        } else {
          await this.kiotvietService.updateInvoice(invoiceId, orderData);
        }
      }

      if (order.status === 7) {
        const invoiceId = await this.cacheManager.get<string>(
          'pancake_order_' + order.id,
        );
        if (invoiceId) {
          await this.kiotvietService.deleteInvoice(invoiceId);
          await this.cacheManager.del('pancake_order_' + order.id);
          this.logger.log(
            `Order ID: ${order.id} has been deleted, removing from cache and KiotViet.`,
          );
        }
      }

      this.logger.log(
        `Successfully processing Pancake order ID: ${order.id} with status: ${order.status}`,
      );
    } catch {
      this.logger.error(
        `Error processing Pancake order ID ${order.id} with status: ${order.status} webhook`,
      );
    }
  }
}
