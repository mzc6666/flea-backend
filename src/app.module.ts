import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserModule } from './modules/user/index.module';
import { AuthModule } from './modules/auth/index.module';
import { GoodsModules } from './modules/goods/index.module';
import { PhotoModule } from './modules/photos/index.module';
import * as express from 'express';
import * as path from 'path';

@Module({
  imports: [UserModule, AuthModule, GoodsModules, PhotoModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(express.static(path.join(__dirname, '..', 'images')))
      .forRoutes('/');
  }
}
