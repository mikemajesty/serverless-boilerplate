import { LoggerService } from '../../logger';
import { ISNSService } from './adapter';
import { SNSService as Service } from './service';

export const SNSService: ISNSService = new Service(LoggerService);
