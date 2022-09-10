import AWS from 'aws-sdk';

import { IAWSService } from './adapter';

export class AWSService implements IAWSService {
  constructor() {
    AWS.config.update({ region: process.env.AWS_REGION });
  }

  public AWS = AWS;
}
