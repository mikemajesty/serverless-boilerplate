export enum Secrets {
  ENV = 'NODE_ENV',
  AWS_ACCESS_KEY_ID = 'AWS_ACCESS_KEY_ID',
  AWS_SECRET_ACCESS_KEY = 'AWS_SECRET_ACCESS_KEY',
  AWS_REGION = 'AWS_REGION',
}

export type SecretsTypes = string | boolean | number | undefined;
