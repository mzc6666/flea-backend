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

const userApi = {
  login,
};

export default userApi;
