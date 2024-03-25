import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  private tokenMap: Map<string, string> = new Map(); // token通过openid和过期时间加密获得
  constructor() {}
}
