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
  return networkHelper.get<IUser.Login.Response>('/sns/jscode2session', params);
};

type Type = {
  access_token: string;
  openid: string;
  lang?: 'zh_CN';
};
/**
 * [登录]
 */
const getUserInfo = (params: Type) => {
  return networkHelper.get<any>('/cgi-bin/user/info', params);
};

const userApi = {
  login,
  getUserInfo,
};

export default userApi;
