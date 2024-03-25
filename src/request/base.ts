import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { data2UrlSearch } from 'src/handler/url';

class NetworkHelper {
  private WEI_XIN_BASEURL = 'https://api.weixin.qq.com';
  private instance: AxiosInstance;
  constructor() {
    this.instance = axios.create();
    this.instance.defaults.baseURL = this.WEI_XIN_BASEURL;
    // this.instance.interceptors.request.use
    // this.instance.interceptors.response.use
  }

  get<T>(
    url: string,
    queryObj?: Record<string, any>,
    options?: AxiosRequestConfig<any>,
  ) {
    const reqUrl = queryObj ? url + data2UrlSearch(queryObj) : url;
    return this.instance.get<T>(reqUrl, options);
  }

  post<T extends Record<string, any>>(
    url: string,
    data: T,
    options: AxiosRequestConfig<T>,
  ) {
    return this.instance.post(url, data, options);
  }
}

const networkHelper = new NetworkHelper();

export default networkHelper;
