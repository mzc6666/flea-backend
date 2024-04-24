// app.module.ts

import { Module } from '@nestjs/common';
import { WebsocketGateway } from './index.gateway';

@Module({
  providers: [WebsocketGateway],
})
export class SocketModule {}
