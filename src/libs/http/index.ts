import { AxiosInstance } from 'axios';

import { IHttpAdapter } from './adapter';
import { HttpService as Service } from './service';

export const HttpService: IHttpAdapter<AxiosInstance> = new Service();
