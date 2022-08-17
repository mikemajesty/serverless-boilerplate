import { LoggerService } from '@libs/logger';
import { ApiException } from '@utils/exception';
import { LambdaService } from '@utils/lambda';
import { v4 as uuidv4 } from 'uuid';

import { errors } from '../static/erros';
import { IMiddlewareAdapter } from './adapter';

export const errorMiddleware = (): IMiddlewareAdapter => {
  const customMiddlewareBefore = async (request) => {
    try {
      const { event, context } = request;

      if (event.headers?.traceid) {
        event.headers.traceId = event.headers?.traceid;
      }

      if (!event.headers.traceId) {
        event.headers.traceId = uuidv4();
      }

      request.id = event.headers.traceId;
      request.event.traceId = request.id;

      LoggerService.httpLogger(request, { on: () => true } as never);

      const functionName = [context.functionName, request.context.functionName].find(Boolean);

      LoggerService.info({
        message: `Lambda: ${functionName} in processing`,
      });
    } catch (error) {
      LoggerService.error(error);
    }
  };

  const customMiddlewareAfter = async (request) => {
    const { response } = request;
    const statusCode = request.response?.statusCode || 200;
    response.statusCode = statusCode;
    request.response = response;
    LoggerService.info({
      message: 'Success',
      obj: { statusCode, status: 'Success' },
    });
  };

  const customMiddlewareOnError = async (request) => {
    const error = new ApiException(request.error.message, request.error.statusCode, request.error.ctx);
    error.traceId = request.id;

    if (request.error?.name !== ApiException.name) {
      error.name = 'Error';
    }

    LoggerService.error(error);

    try {
      const statusCode = request.error.statusCode || 500;
      return LambdaService.formatJSONResponse({
        error: {
          functionName: request.context.functionName,
          context: request.error?.context,
          message: [errors[request.error.statusCode], request.error.message].find(Boolean),
          traceId: request.id,
        },
        statusCode,
        data: undefined,
      });
    } catch (error) {
      LoggerService.error(error);
    }
  };

  return {
    before: customMiddlewareBefore,
    after: customMiddlewareAfter,
    onError: customMiddlewareOnError,
  };
};
