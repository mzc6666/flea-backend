import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import * as WebSocket from 'ws';
import { Socket } from 'socket.io';
import { Message } from 'src/db/modules/messages';
import { BaseMessageBody } from './types';
import { AuthService } from '../auth/index.provider';
import { User } from 'src/db/modules/user';
import { ClientSocketBody } from './classes';

@WebSocketGateway(17030)
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: WebSocket;

  socketMap: Map<string, Socket> = new Map();

  constructor(private readonly authService: AuthService) {}

  handleConnection(client: Socket) {}

  handleDisconnect(client: WebSocket) {}

  /* 用户上线 */
  @SubscribeMessage('online')
  async online(client: Socket, data: BaseMessageBody) {
    this.socketMap.set(data.token, client);
    const openId = this.authService.token2OpenId(data.token);
    const userId = (await User.findOne({ openId }))._id;
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .populate('sender')
      .populate('receiver');
    client.send(JSON.stringify(new ClientSocketBody('lists_get', messages)));
  }
}
