import AWS from 'aws-sdk';

export abstract class IAWSService<T = typeof AWS> {
  AWS: T;
}
