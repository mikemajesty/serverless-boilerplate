import { ConfigService } from '@libs/config';

import { ILoggerAdapter } from './adapter';
import { LoggerService as Service } from './service';

export const LoggerService: ILoggerAdapter = new Service(ConfigService).connect();
