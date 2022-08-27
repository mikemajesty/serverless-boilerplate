import { LoggerService } from '@libs/logger';

import { httpErrorHandlerMiddleware } from '../http-error';

describe('httpErrorHandlerMiddleware', () => {
  describe('before', () => {
    test('should customMiddlewareBefore successfully with traceId', () => {
      const middleware = httpErrorHandlerMiddleware();

      middleware.before({
        event: { headers: { traceid: 'traceid' } },
        context: { functionName: 'functionName' },
      });

      expect(LoggerService.info).toHaveBeenCalled();
    });

    test('should customMiddlewareBefore successfully without traceId', () => {
      const middleware = httpErrorHandlerMiddleware();

      middleware.before({
        event: { headers: {} },
        context: { functionName: 'functionName' },
        ctx: {},
      });

      expect(LoggerService.info).toHaveBeenCalled();
    });

    test('should throw missing function name', () => {
      const middleware = httpErrorHandlerMiddleware();

      jest.spyOn(LoggerService, 'error').mockReturnValue(null);
      middleware.before({ event: { headers: {} } });
      expect(LoggerService.error).toHaveBeenCalled();
    });
  });

  describe('after', () => {
    test('should after with statusCode', () => {
      const middleware = httpErrorHandlerMiddleware();
      const res = { response: { statusCode: 201 } };
      middleware.after(res);
      expect(res).toEqual({ response: { statusCode: 201 } });
      expect(LoggerService.info).toHaveBeenCalled();
    });

    test('should after without statusCode', () => {
      const middleware = httpErrorHandlerMiddleware();
      const res = { response: {} };
      middleware.after(res);
      expect(res).toEqual({ response: { statusCode: 200 } });
      expect(LoggerService.info).toHaveBeenCalled();
    });
  });

  describe('customMiddlewareOnError', () => {
    test('should customMiddlewareOnError with statusCode', async () => {
      const middleware = httpErrorHandlerMiddleware();
      const error = { message: 'message', statusCode: 500 };

      const res = await middleware.onError({ error, context: 'context', traceId: 'traceId' });

      expect(res).toEqual({
        body: '{"error":{"message":"Internal Server Error."},"statusCode":500}',
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        isBase64Encoded: false,
      });
    });

    test('should customMiddlewareOnError without statusCode', async () => {
      const middleware = httpErrorHandlerMiddleware();
      const error = { message: 'message' };

      const res = await middleware.onError({ error, context: 'context', traceId: 'traceId' });
      expect(res).toEqual({
        statusCode: 500,
        body: '{"error":{"message":"message"},"statusCode":500}',
        headers: { 'Content-Type': 'application/json' },
        isBase64Encoded: false,
      });
    });
  });
});
