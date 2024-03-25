import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserModule } from './modules/user/index.module';
import { AuthModule } from './modules/auth/index.module';
import { AuthMiddleWare } from './middleware/verify-auth';

@Module({
  imports: [UserModule, AuthModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleWare).forRoutes('*');
  }
}
