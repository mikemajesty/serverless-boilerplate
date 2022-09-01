import { LoggerService } from '@libs/logger';
import { LambdaService } from '@utils/lambda';
import { v4 as uuidv4 } from 'uuid';

import { errors } from '../static/erros';
import { IMiddlewareAdapter } from './adapter';

/**
 * @description http request only
 */
export const httpErrorHandlerMiddleware = (): IMiddlewareAdapter => {
  const customMiddlewareBefore = async (request) => {
    try {
      const { event } = request;

      event.logger = LoggerService;

      if (event.headers?.traceid) {
        event.headers.traceId = event.headers?.traceid;
      }

      if (!event.headers?.traceId) {
        event.headers.traceId = uuidv4();
      }

      request.id = event.headers.traceId;
      request.event.traceId = request.id;

      LoggerService.httpLogger(request, { on: () => true } as never);

      LoggerService.info({
        message: `Lambda: ${request.context.functionName} in processing`,
      });
    } catch (error) {
      LoggerService.error(error);
      throw error;
    }
  };

  const customMiddlewareAfter = async (request) => {
    const { response } = request;
    const statusCode = request.response?.statusCode || 200;
    response.statusCode = statusCode;
    request.response = response;
    LoggerService.info({
      message: 'Success',
      obj: { statusCode },
    });
  };

  const customMiddlewareOnError = async (request) => {
    const message = [request.error?.response?.statusText, request.error.message].find(Boolean);
    const status = [request.error?.response?.status, request.error?.statusCode, request.error?.status, 500].find(
      Boolean,
    );

    request.error['statusCode'] = status;
    request.error['message'] = message;
    request.error['context'] = request.context;
    request.error['traceId'] = request.id;

    LoggerService.error(request.error);

    try {
      const statusCode = [request.error.statusCode, request.statusCode, 500].find(Boolean);
      return LambdaService.formatJSONResponse({
        error: {
          context: [request.ctx, request.context.functionName].find(Boolean),
          message: [errors[String(status)], message].find(Boolean),
          traceId: request.id,
          providerStatus: [request.error?.status, request.error?.response?.status].find(Boolean),
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
