import { ILoggerAdapter } from '@libs/logger/adapter';
import { AWSError, SNS } from 'aws-sdk';

import { IAWSService } from '../adapter';
import { ISNSService } from './adapter';
import { PromiseResult } from './types';

export class SNSService implements ISNSService {
  private SNS: SNS;

  constructor(private awsService: IAWSService, private loggerService: ILoggerAdapter, private awsENDPoint: string) {
    this.SNS = this.getInstance();
  }

  async publish(params: SNS.Types.PublishInput): Promise<PromiseResult<SNS.Types.PublishResponse, AWSError>> {
    const response = await this.getInstance().publish(params).promise();
    this.loggerService.info({ message: 'Success SNS publish', obj: { sns: response } });
    return response;
  }

  getInstance(): SNS {
    if (this.SNS) {
      return this.SNS;
    }
    return new this.awsService.AWS.SNS({ endpoint: this.awsENDPoint });
  }
}
