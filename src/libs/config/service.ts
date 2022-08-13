import { IConfigAdapter } from './adapter';
import { Secrets } from './types';

export class ConfigService implements IConfigAdapter {
  get(key: Secrets): unknown {
    return process.env[String(key)];
  }
}
