import { Secrets } from './types';

export interface IConfigAdapter {
  get(key: Secrets);
}
