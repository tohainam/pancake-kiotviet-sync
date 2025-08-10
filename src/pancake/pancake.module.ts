import { Module } from '@nestjs/common';
import { PancakeService } from './pancake.service';

@Module({
  providers: [PancakeService],
})
export class PancakeModule {}
