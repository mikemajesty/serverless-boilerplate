import middy from '@middy/core';
import middyJsonBodyParser from '@middy/http-json-body-parser';
import { errorMiddleware } from '@utils/middlewares/error.middleware';
import { APIGatewayProxyResult, Context } from 'aws-lambda';

export const LambdaService = {
  middyfy(handler): middy.MiddyfiedHandler<any, any, any, Context> {
    return middy(handler).use(middyJsonBodyParser()).use(errorMiddleware());
  },

  formatJSONResponse(response: Record<string, unknown>, status: number = 200): APIGatewayProxyResult {
    return {
      statusCode: status,
      body: JSON.stringify(response),
    };
  },

  handlerPath(context: string): string {
    return `${context.split(process.cwd())[1].slice(1).replace(/\\/g, '/')}`;
  },
};
