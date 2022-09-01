import { AWSError, Lambda } from 'aws-sdk';

import { PromiseResult } from '../sns/types';

export interface ILambdaService {
  invoke(
    config: Lambda.Types.InvocationRequest,
    callback?: (err: AWSError, data: Lambda.Types.InvocationResponse) => void,
  ): Promise<PromiseResult<Lambda.Types.InvocationResponse, AWSError>>;

  getInstance(config?: Lambda.Types.ClientConfiguration): Lambda;
}
