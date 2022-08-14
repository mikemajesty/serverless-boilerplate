import { IConfigAdapter } from './adapter';
import { Secrets, SecretsTypes } from './types';

export class ConfigService implements IConfigAdapter {
  get(key: Secrets): SecretsTypes {
    return process.env[String(key)];
  }
}
