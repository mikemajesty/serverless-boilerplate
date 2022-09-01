import { AWSError, ConfigurationOptions, Lambda } from 'aws-sdk';

import { AWSService } from '../service';
import { PromiseResult } from '../sns/types';
import { ILambdaService } from './adapter';

export class LambdaService extends AWSService implements ILambdaService {
  private lambda: Lambda;

  constructor(config?: ConfigurationOptions) {
    super(config);
    this.lambda = this.getInstance();
  }

  async invoke(
    config: Lambda.Types.InvocationRequest,
    callback?: (err: AWSError, data: Lambda.Types.InvocationResponse) => void,
  ): Promise<PromiseResult<Lambda.Types.InvocationResponse, AWSError>> {
    return await this.getInstance().invoke(config, callback).promise();
  }

  getInstance(config?: Lambda.Types.ClientConfiguration): Lambda {
    if (this.lambda) {
      return this.lambda;
    }
    return new Lambda(config);
  }
}
