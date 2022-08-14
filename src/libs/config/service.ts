import { ApiException, HttpStatus } from '@utils/exception';

import { IConfigAdapter } from './adapter';
import { Secrets, SecretsTypes } from './types';

export class ConfigService implements IConfigAdapter {
  get(key: Secrets): SecretsTypes {
    const env = process.env[String(key)];
    if (!env)
      throw new ApiException(
        `${key} is not defined in environment variables`,
        HttpStatus.NOT_FOUND,
        'ConfigService/get',
      );

    return env;
  }
}
