import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { PancakeOrder } from 'src/types';

@Controller('webhooks')
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);

  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('/pancake/orders')
  async handlePancakeOrdersWebhook(@Body() body: PancakeOrder) {
    this.logger.log(
      `Received Pancake order webhook for order ID: ${body.id} with status: ${body.status}`,
    );
    await this.webhooksService.handlePancakeOrdersWebhook(body);
    this.logger.log(
      `Processed Pancake order webhook for order ID: ${body.id} with status: ${body.status}`,
    );
    return true;
  }

  @Get('/pancake/orders')
  async Test() {
    await this.webhooksService.handlePancakeOrdersWebhook({} as PancakeOrder);
    return true;
  }
}
