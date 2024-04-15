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
  private access_token: string; // 微信后端接口调用凭证

  private access_token_expire_time: string; // access_token过期时间

  private authMap: Map<OpenId, AuthData>; // 用户的鉴权数据

  constructor() {
    this.authMap = new Map();
  }

  saveAccessData(option: AccessData) {
    const { access_token, access_token_expire_time } = option;
    access_token && (this.access_token = access_token);
    access_token_expire_time &&
      (this.access_token_expire_time = access_token_expire_time);
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

  saveAuthData(
    openId: string,
    data: {
      token?: string;
      session_key?: string;
    },
  ) {
    this.authMap.set(openId, {
      token: data.token ?? this.authMap.get(openId)?.token ?? null,
      session_key:
        data.session_key ?? this.authMap.get(openId)?.session_key ?? null,
    });
  }

  token2OpenId(token: string) {
    const result = jwt.verify(token, GLOBAL_CONFIGS.appSecret) as any;
    return result.id;
  }
}
