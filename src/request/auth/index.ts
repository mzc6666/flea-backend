import { GLOBAL_CONFIGS } from 'src/config';
import networkHelper from '../base';
import { I_Auth } from './types';

/**
 * [检查session_key对应的登录状态]
 */
const checkLoginStatus = (params: I_Auth.CheckLoginParams) => {
  params.sig_method = 'hmac_sha256';
  return networkHelper.get<I_Auth.checkLoginResponse>(
    '/wxa/checksession',
    params,
  );
};

/**
 * [获取access_token]
 */
export const getAccessToken = () => {
  const params: I_Auth.AccessToken.Params = {
    grant_type: 'client_credential',
    appid: GLOBAL_CONFIGS.appId,
    secret: GLOBAL_CONFIGS.appSecret,
  };
  return networkHelper.get<I_Auth.AccessToken.Response>(
    '/cgi-bin/token',
    params,
  );
};

const authApi = {
  checkLoginStatus,
  getAccessToken,
};

export default authApi;
