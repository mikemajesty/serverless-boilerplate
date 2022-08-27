import { IHttpAdapter } from './adapter';
import { HttpService as Service } from './service';

export const HttpService: IHttpAdapter = new Service();
