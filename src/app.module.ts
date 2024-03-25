import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/index.module';

@Module({
  imports: [UserModule],
})
export class AppModule {}
