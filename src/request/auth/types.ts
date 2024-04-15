export namespace I_Auth {
  export interface CheckLoginParams {
    access_token: string;
    openid: string;
    signature: string;
    sig_method?: string;
  }

  export interface checkLoginResponse {
    errcode: string;
    errmsg: string;
  }

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
