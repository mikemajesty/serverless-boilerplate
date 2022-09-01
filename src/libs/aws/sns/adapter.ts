import { AWSError, SNS } from 'aws-sdk';

import { PromiseResult } from './types';

export interface ISNSService {
  publish(
    params: SNS.Types.PublishInput,
    config?: SNS.Types.ClientConfiguration,
  ): Promise<PromiseResult<SNS.Types.PublishResponse, AWSError>>;

  getInstance(config?: SNS.Types.ClientConfiguration): SNS;
}
