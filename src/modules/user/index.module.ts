import { Module } from '@nestjs/common';
import { UserController } from './index.controller';
import cyproto from 'node:crypto';
import { UserService } from './index.service';

@Module({
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
