import { Module } from '@nestjs/common';
import { KiotvietService } from './kiotviet.service';
import { CacheModule } from '@nestjs/cache-manager';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [CacheModule.register(), ConfigModule.forRoot(), HttpModule],
  providers: [KiotvietService],
})
export class KiotvietModule {}
