import { Module } from '@nestjs/common';
import { KiotvietService } from './kiotviet.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { StorageModule } from 'src/storage/storage.module';

@Module({
  imports: [ConfigModule.forRoot(), StorageModule, HttpModule],
  providers: [KiotvietService],
})
export class KiotvietModule {}
