import { ILoggerAdapter } from '@libs/logger/adapter';
import { AWSError, ConfigurationOptions, SNS } from 'aws-sdk';

import { AWSService } from '../service';
import { ISNSService } from './adapter';
import { PromiseResult } from './types';

export class SNSService extends AWSService implements ISNSService {
  private SNS: SNS;

  constructor(private logger: ILoggerAdapter, options?: ConfigurationOptions) {
    super(options);
    this.SNS = this.getInstance();
  }

  async publish(params: SNS.Types.PublishInput): Promise<PromiseResult<SNS.Types.PublishResponse, AWSError>> {
    const response = await this.getInstance().publish(params).promise();
    this.logger.info({ message: 'Success SNN publish', obj: { sns: response } });
    return response;
  }

  getInstance(config?: SNS.Types.ClientConfiguration): SNS {
    if (this.SNS) {
      return this.SNS;
    }
    return new this.AWS.SNS(config || { endpoint: 'http://0.0.0.0:4566/' });
  }
}
