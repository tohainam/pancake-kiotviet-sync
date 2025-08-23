import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { WebhooksService } from '../webhooks.service';
import { Job } from 'bullmq';
import { PancakeOrder } from 'src/types';

@Processor('pancake-webhook', {
  concurrency: 1,
  limiter: {
    max: 1,
    duration: 5000,
  },
})
export class PancakeWebhookProcessor extends WorkerHost {
  private readonly logger = new Logger(PancakeWebhookProcessor.name);

  constructor(private readonly webhooksService: WebhooksService) {
    super();
  }

  async process(job: Job<PancakeOrder, void, string>) {
    this.logger.log(
      `Process Queue: ${job.data.id} with status: ${job.data.status}`,
    );

    await this.webhooksService.handlePancakeOrdersWebhook(job.data);

    this.logger.log(
      `Processed Queue: ${job.data.id} with status: ${job.data.status}`,
    );
  }
}
