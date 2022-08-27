import { ILoggerAdapter } from './adapter';
import { LoggerService as Service } from './service';

export const LoggerService: ILoggerAdapter = new Service().connect();
