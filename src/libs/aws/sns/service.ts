import { ILoggerAdapter } from '@libs/logger/adapter';
import { AWSError, ConfigurationOptions, SNS } from 'aws-sdk';

import { AWSService } from '../service';
import { ISNSService } from './adapter';
import { PromiseResult } from './types';

export class SNSService extends AWSService implements ISNSService {
  constructor(private logger: ILoggerAdapter, options?: ConfigurationOptions) {
    super(options);
  }

  async publish(
    params: SNS.Types.PublishInput,
    config?: SNS.Types.ClientConfiguration,
  ): Promise<PromiseResult<SNS.Types.PublishResponse, AWSError>> {
    const sns = new this.AWS.SNS(config || { endpoint: 'http://0.0.0.0:4566/' });
    const response = await sns.publish(params).promise();
    this.logger.info({ message: 'Success SNN publish', obj: { sns: response } });
    return response;
  }
}
