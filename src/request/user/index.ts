import { GLOBAL_CONFIGS } from 'src/config';
import networkHelper from '../base';
import { IUser } from './type';

/**
 * [登录]
 */
const login = (params: IUser.Login.Params) => {
  params.appid = params.appid ?? GLOBAL_CONFIGS.appId;
  params.secret = params.secret ?? GLOBAL_CONFIGS['appSecret'];
  params.grant_type = 'authorization_code';
  console.log('params', params);
  return networkHelper.get('/sns/jscode2session', params);
};

/**
 * [获取access_token]
 */
export const getAccessToken = () => {
  const params: IUser.AccessToken.Params = {
    grant_type: 'client_credential',
    appid: GLOBAL_CONFIGS.appId,
    secret: GLOBAL_CONFIGS.appSecret,
  };
  return networkHelper.get('/cgi-bin/token', params);
};

const userApi = {
  login,
  getAccessToken,
};

export default userApi;
