import middy from '@middy/core';
import middyJsonBodyParser from '@middy/http-json-body-parser';
import { APIGatewayProxyResult, Context } from 'aws-lambda';

import { ResponsePartial, ResponseType } from './types';

export const LambdaService = {
  middyfy(handler): middy.MiddyfiedHandler<unknown, unknown, unknown, Context> {
    return middy(handler).use(middyJsonBodyParser());
  },

  formatJSONResponse(response: ResponseType): APIGatewayProxyResult {
    return {
      statusCode: [response.statusCode, 200].find((s) => s) as number,
      body: JSON.stringify(response),
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
