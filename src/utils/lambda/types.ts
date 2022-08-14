import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import type { FromSchema } from 'json-schema-to-ts';

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & {
  body: FromSchema<S>;
};

export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>;

export type ResponsePartial = {
  traceId?: string;
  statusCode?: number;
};

export type ResponseType = {
  data: Record<string, unknown>;
  error?: Record<string, unknown>;
  traceId?: string;
  statusCode?: number;
};
