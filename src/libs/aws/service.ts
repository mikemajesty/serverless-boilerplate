import { ConfigService, Secrets } from '@libs/config';
import AWS, { ConfigurationOptions } from 'aws-sdk';

export abstract class AWSService {
  constructor(config?: ConfigurationOptions) {
    AWS.config.update(config || { region: ConfigService.get(Secrets.AWS_REGION) });
  }

  public AWS = AWS;
}
