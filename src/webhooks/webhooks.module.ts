import { Module } from '@nestjs/common';
import { WebhooksController } from './webhooks.controller';
import { PancakeService } from 'src/pancake/pancake.service';
import { PancakeModule } from 'src/pancake/pancake.module';
import { KiotvietModule } from 'src/kiotviet/kiotviet.module';
import { KiotvietService } from 'src/kiotviet/kiotviet.service';
import { CacheModule } from '@nestjs/cache-manager';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { WebhooksService } from './webhooks.service';

@Module({
  imports: [
    CacheModule.register(),
    ConfigModule.forRoot(),
    HttpModule,
    PancakeModule,
    KiotvietModule,
  ],
  controllers: [WebhooksController],
  providers: [PancakeService, KiotvietService, WebhooksService],
})
export class WebhooksModule {}
