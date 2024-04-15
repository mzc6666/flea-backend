import { Module } from '@nestjs/common';
import { GoodsController } from './index.controller';

@Module({
  controllers: [GoodsController],
})
export class GoodsModules {}
