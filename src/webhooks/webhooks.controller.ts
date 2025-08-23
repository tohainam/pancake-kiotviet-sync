import { Body, Controller, Logger, Post } from '@nestjs/common';
import { PancakeOrder } from 'src/types';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Controller('webhooks')
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);

  constructor(
    @InjectQueue('pancake-webhook')
    private readonly pancakeWebhookQueue: Queue<PancakeOrder>,
  ) {}

  @Post('/pancake/orders')
  async handlePancakeOrdersWebhook(@Body() body: PancakeOrder) {
    this.logger.log(
      `Received Pancake order webhook for order ID: ${body.id} with status: ${body.status}`,
    );

    const response = await this.pancakeWebhookQueue.add('process', body, {
      removeOnComplete: true,
      removeOnFail: true,
    });

    this.logger.log('Job added to queue:', response.id);

    this.logger.log(
      `Processed Pancake order webhook for order ID: ${body.id} with status: ${body.status}`,
    );
    return true;
  }
}
