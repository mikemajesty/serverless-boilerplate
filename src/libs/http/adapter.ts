import { AxiosInstance, AxiosRequestConfig } from 'axios';

export interface IHttpAdapter<T = AxiosInstance> {
  instance<TConfig = AxiosRequestConfig>(config?: TConfig): T;
}
