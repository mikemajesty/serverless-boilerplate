import { AxiosInstance } from 'axios';
export interface IHttpAdapter<T = AxiosInstance> {
  instance(config?: unknown): T;
}
