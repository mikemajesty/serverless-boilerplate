import { HttpLogger } from 'pino-http';

import { ILoggerAdapter } from './adapter';
import { LoggerService as Service } from './service';

export const LoggerService: ILoggerAdapter<HttpLogger> = new Service().connect();
