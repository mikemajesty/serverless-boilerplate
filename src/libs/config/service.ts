import { ApiException, HttpStatus } from '@utils/exception';

import { IConfigAdapter } from './adapter';
import { Secrets } from './types';

export class ConfigService implements IConfigAdapter {
  get<T = string>(key: Secrets): T {
    const env = process.env[String(key)];
    if (!env)
      throw new ApiException(
        `${key} is not defined in environment variables`,
        HttpStatus.NOT_FOUND,
        'ConfigService/get',
      );

    return env as unknown as T;
  }
}
