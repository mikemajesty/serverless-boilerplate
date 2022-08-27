import { Secrets } from './types';

export interface IConfigAdapter {
  get<T>(key: Secrets): T;
}
