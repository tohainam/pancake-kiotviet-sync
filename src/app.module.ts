import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebhooksModule } from './webhooks/webhooks.module';
import { KiotvietModule } from './kiotviet/kiotviet.module';
import { PancakeModule } from './pancake/pancake.module';

@Module({
  imports: [WebhooksModule, KiotvietModule, PancakeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
