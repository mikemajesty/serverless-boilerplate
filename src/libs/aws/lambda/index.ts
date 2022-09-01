import { ILambdaService } from './adapter';
import { LambdaService as Service } from './service';

export const LambdaService: ILambdaService = new Service();
