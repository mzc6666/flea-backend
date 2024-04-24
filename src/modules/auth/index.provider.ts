import { Injectable } from '@nestjs/common';
import { AuthData, OpenId } from './types';
import * as jwt from 'jsonwebtoken';
import { GLOBAL_CONFIGS } from 'src/config';

interface AccessData {
  access_token?: string;
  access_token_expire_time?: string;
}

@Injectable()
export class AuthService {
  private sessionKeyMap: Map<OpenId, string>; // sessionKey 与 openId 的对应关系

  constructor() {
    this.sessionKeyMap = new Map();
  }

  generateToken(openId: string) {
    return jwt.sign(
      {
        id: openId,
      },
      GLOBAL_CONFIGS.appSecret,
      {
        expiresIn: '2d',
      },
    );
  }

  saveSessionKey(openId: string, session_key: string) {
    this.sessionKeyMap.set(openId, session_key);
  }

  token2OpenId(token: string) {
    try {
      const result = jwt.verify(token, GLOBAL_CONFIGS.appSecret) as any;
      return result.id;
    } catch (error) {
      console.log('token => openId error', error);
      console.log('token', token);
      throw new Error(error);
    }
  }
}
