import { ILoggerAdapter } from '@libs/logger/adapter';
import { SNSMessage } from 'aws-lambda';
import { Response } from 'aws-sdk';

export type PromiseResult<D, E> = D & { $response: Response<D, E> };

export type SNSMessageType = SNSMessage & {
  logger: ILoggerAdapter;
};
