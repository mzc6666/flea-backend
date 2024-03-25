import { Global, Module } from '@nestjs/common';
import { AuthService } from './index.provider';

@Global()
@Module({
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
