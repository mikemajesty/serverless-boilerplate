import middy from '@middy/core';
import middyJsonBodyParser from '@middy/http-json-body-parser';
import { APIGatewayProxyResult, Context, Handler } from 'aws-lambda';

import { ResponsePartial, ResponseType } from './types';

export const LambdaService = {
  middyfy(handler: Handler): middy.MiddyfiedHandler<unknown, unknown, unknown, Context> {
    return middy(handler).use(middyJsonBodyParser());
  },

  formatJSONResponse(response: ResponseType): APIGatewayProxyResult {
    return {
      statusCode: [response.statusCode, 200].find((s) => s),
      body: JSON.stringify(response),
      headers: { 'Content-Type': 'application/json' },
      isBase64Encoded: false,
    };
  },

  handlerPath(context: string): string {
    return `${context.split(process.cwd())[1].slice(1).replace(/\\/g, '/')}`;
  },

  formatPartialResponse(event): ResponsePartial {
    return {
      traceId: event.traceId,
    };
  },
};
