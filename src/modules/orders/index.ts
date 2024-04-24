import { Module } from '@nestjs/common';
import { OrdersController } from './index.controller';

@Module({
  controllers: [OrdersController],
})
export class OrderModule {}
