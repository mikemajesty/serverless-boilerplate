import { IConfigAdapter } from './adapter';
import { ConfigService as Service } from './service';

export * from './adapter';
export * from './types';

export const ConfigService: IConfigAdapter = new Service();
