export namespace IUser {
  /**
   * [登录]
   */
  export namespace Login {
    export interface Params {
      // 小程序 appId
      appid?: string;
      // 小程序 appSecret
      secret?: string;
      // 登录时获取的 code
      js_code: string;
      // 授权类型，此处只需填写 authorization_code
      grant_type?: string;
    }

    export interface Response {
      session_key: string;
      unionid: string;
      errmsg: string;
      openid: string;
      errcode: number;
    }
  }

  /**
   * [access_token]
   */
  export namespace AccessToken {
    export interface Params {
      grant_type?: 'client_credential';
      appid?: string;
      secret?: string;
    }
    export interface Response {
      access_token: string;
      expires_in: number;
    }
  }
}
