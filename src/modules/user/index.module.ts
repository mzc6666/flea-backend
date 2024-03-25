import { Module } from '@nestjs/common';
import { UserController } from './index.controller';

@Module({
  controllers: [UserController],
})
export class UserModule {}
