import { Secrets, SecretsTypes } from './types';

export interface IConfigAdapter {
  get(key: Secrets): SecretsTypes;
}
