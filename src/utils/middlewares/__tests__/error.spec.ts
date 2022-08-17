import { LoggerService } from '@libs/logger';

import { errorMiddleware } from '../error';

describe('errorMiddleware', () => {
  describe('before', () => {
    test('should customMiddlewareBefore successfully with traceId', () => {
      const middleware = errorMiddleware();

      middleware.before({
        event: { headers: { traceid: 'traceid' } },
        context: { functionName: 'functionName' },
      });

      expect(LoggerService.info).toHaveBeenCalled();
    });

    test('should customMiddlewareBefore successfully without traceId', () => {
      const middleware = errorMiddleware();

      middleware.before({
        event: { headers: {} },
        context: { functionName: 'functionName' },
        ctx: {},
      });

      expect(LoggerService.info).toHaveBeenCalled();
    });

    test('should throw missing function name', () => {
      const middleware = errorMiddleware();

      middleware.before({ event: { headers: {} } });
      expect(LoggerService.error).toHaveBeenCalled();
    });
  });

  describe('after', () => {
    test('should after with statusCode', () => {
      const middleware = errorMiddleware();
      const res = { response: { statusCode: 201 } };
      middleware.after(res);
      expect(res).toEqual({ response: { statusCode: 201 } });
      expect(LoggerService.info).toHaveBeenCalled();
    });

    test('should after without statusCode', () => {
      const middleware = errorMiddleware();
      const res = { response: {} };
      middleware.after(res);
      expect(res).toEqual({ response: { statusCode: 200 } });
      expect(LoggerService.info).toHaveBeenCalled();
    });
  });

  describe('customMiddlewareOnError', () => {
    test('should customMiddlewareOnError with statusCode', async () => {
      const middleware = errorMiddleware();
      const error = { message: 'message', statusCode: 500 };

      const res = await middleware.onError({ error, context: 'context', traceId: 'traceId' });
      expect(res).toEqual({
        body: '{"error":{"message":"Internal Server Error."},"statusCode":500}',
        statusCode: 500,
      });
    });

    test('should customMiddlewareOnError without statusCode', async () => {
      const middleware = errorMiddleware();
      const error = { message: 'message' };

      const res = await middleware.onError({ error, context: 'context', traceId: 'traceId' });
      expect(res).toEqual({
        body: '{"error":{"message":"message"},"statusCode":500}',
        statusCode: 500,
      });
    });
  });
});
