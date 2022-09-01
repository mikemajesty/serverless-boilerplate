import { ILoggerAdapter } from '@libs/logger/adapter';
import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler, SNSEvent, SNSMessage, SQSEvent } from 'aws-lambda';
import type { FromSchema } from 'json-schema-to-ts';

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & {
  body: FromSchema<S>;
};

export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>;

export type HttpEventType = Omit<APIGatewayProxyEvent, 'body'> & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any;
  traceId: string;
  logger: ILoggerAdapter;
};

export type SQSMessageType = SNSMessage & {
  logger: ILoggerAdapter;
};

export type SNSMessageType = SNSMessage & {
  logger: ILoggerAdapter;
};

export type SQSEventType = SQSEvent & {
  logger: ILoggerAdapter;
};

export type SNSEventType = SNSEvent & {
  logger: ILoggerAdapter;
};

export type ResponsePartial = {
  traceId?: string;
  statusCode?: number;
};

export type ResponseType = {
  data: Record<string, unknown> | unknown;
  error?: Record<string, unknown>;
  traceId?: string;
  statusCode?: number;
};
