import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserModule } from './modules/user/index.module';
import { AuthModule } from './modules/auth/index.module';
import { GoodsModules } from './modules/goods/index.module';
import { PhotoModule } from './modules/photos/index.module';
import { CommentModule } from './modules/comments/index.module';
import { OrderModule } from './modules/orders';
import { SocketModule } from './modules/messages/index.module';
import * as express from 'express';
import { WebsocketGateway } from './modules/messages/index.gateway';
import * as path from 'path';
import { WechatAccessTokenMiddleware } from './middleware/verify-accessToken';
import { TokenMiddleWare } from './middleware/verify-auth';

@Module({
  imports: [
    UserModule,
    AuthModule,
    GoodsModules,
    PhotoModule,
    OrderModule,
    CommentModule,
    SocketModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(express.static(path.join(__dirname, '..', 'images')))
      .forRoutes('/');

    /** WechatAccessTokenMiddleware */
    consumer.apply(WechatAccessTokenMiddleware).forRoutes('*');

    /** TokenMiddleWare */
    consumer
      .apply(TokenMiddleWare)
      .exclude({ path: 'user/login', method: RequestMethod.GET })
      .forRoutes('*');
  }
}
