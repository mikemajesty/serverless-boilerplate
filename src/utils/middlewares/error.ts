import { LoggerService } from '@libs/logger';
import { MiddlewareObj } from '@middy/core';
import { ApiException } from '@utils/exception';
import { LambdaService } from '@utils/lambda';
import { Context } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';

import { errors } from '../static/erros';

export const errorMiddleware = ():
  | MiddlewareObj<unknown, unknown, unknown, Context>
  | MiddlewareObj<unknown, unknown, unknown, Context>[] => {
  const customMiddlewareBefore = async (request) => {
    const { event } = request;
    event.headers.traceId = uuidv4();
    request.id = event.headers.traceId;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    LoggerService.httpLogger(request, { on: () => true } as any);

    LoggerService.info({
      message: `Lambda: ${request.ctx.functionName || request.context.functionName} in processing`,
    });
  };

  const customMiddlewareAfter = async (request) => {
    const { response } = request;
    response.id = request.id;
    request.response = response;
    LoggerService.info({
      message: 'Success',
      obj: { statusCode: request.response?.statusCode || 200 },
    });
  };

  const customMiddlewareOnError = async (request) => {
    const error = new ApiException(request.error.message, request.error.statusCode, request.context);
    error.traceid = request.id;
    LoggerService.error(error);
    const statusCode = request.error.statusCode || 500;
    return LambdaService.formatJSONResponse({
      error: {
        context: request.ctx || request.context.functionName,
        message: errors[request.error.statusCode] || request.error.message,
        statusCode,
        traceId: request.id,
      },
      statusCode,
    });
  };

  return {
    before: customMiddlewareBefore,
    after: customMiddlewareAfter,
    onError: customMiddlewareOnError,
  };
};
