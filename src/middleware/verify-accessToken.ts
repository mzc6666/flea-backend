import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import fetch from 'node-fetch';
import { authApi } from 'src/request';

@Injectable()
export class WechatAccessTokenMiddleware implements NestMiddleware {
  private accessToken: string;
  private expiresIn: number;
  private readonly appId = 'YOUR_APP_ID';
  private readonly appSecret = 'YOUR_APP_SECRET';

  async getAccessToken(): Promise<string> {
    if (!this.accessToken || Date.now() >= this.expiresIn) {
      await this.refreshAccessToken();
    }
    return this.accessToken;
  }

  private async refreshAccessToken(): Promise<void> {
    try {
      const { data } = await authApi.getAccessToken();
      if (data.access_token) {
        this.accessToken = data.access_token;
        this.expiresIn = Date.now() + (data.expires_in - 60) * 1000; // 提前60秒过期
      }
    } catch (error) {
      console.error('获取 access_token 失败:', error);
    }
  }

  async use(req: Request, res: Response, next: NextFunction) {
    await this.getAccessToken();
    req['access_token'] = this.accessToken;
    next();
  }
}
