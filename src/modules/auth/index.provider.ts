import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  private access_token: string;
  private expires_in: number;
  private tokenMap: Map<string, string> = new Map(); // token通过openid和过期时间加密获得

  getAccessToken() {
    return this.access_token;
  }
  setAccessToken(access_token: string) {
    this.access_token = access_token;
  }

  getEexpirationTime() {
    return this.expires_in;
  }
  setEexpirationTime(expires_in: number) {
    this.expires_in = expires_in;
  }

  setTokenByOpenId(id: string) {}

  getTokenByOpenId(id: string) {}
}
