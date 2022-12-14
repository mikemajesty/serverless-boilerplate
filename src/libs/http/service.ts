import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

import { IHttpAdapter } from './adapter';

export class HttpService implements IHttpAdapter {
  instance(config?: AxiosRequestConfig): AxiosInstance {
    return axios.create(config || { timeout: 5000 });
  }
}
