import { httpErrorHandlerMiddleware } from '../http-error';

describe('httpErrorHandlerMiddleware', () => {
  describe('before', () => {
    test('should customMiddlewareBefore successfully with traceId', async () => {
      const middleware = httpErrorHandlerMiddleware();

      await expect(
        middleware.before({
          event: { headers: { traceid: 'traceid' } },
          context: { functionName: 'functionName' },
        }),
      ).resolves.toBeUndefined();
    });

    test('should customMiddlewareBefore successfully without traceId', async () => {
      const middleware = httpErrorHandlerMiddleware();

      await expect(
        middleware.before({
          event: { headers: {} },
          context: { functionName: 'functionName' },
          ctx: {},
        }),
      ).resolves.toBeUndefined();
    });

    test('should throw missing function name', async () => {
      const middleware = httpErrorHandlerMiddleware();

      await expect(middleware.before({ event: { headers: {} } })).rejects.toThrow();
    });
  });

  describe('after', () => {
    const EVENT_MOCK = { logger: { info: jest.fn() } };

    test('should after with statusCode', async () => {
      const middleware = httpErrorHandlerMiddleware();
      const res = { response: { statusCode: 201 }, event: EVENT_MOCK };
      await middleware.after(res);
      expect(res.response).toEqual({ statusCode: 201 });
    });

    test('should after without statusCode', async () => {
      const middleware = httpErrorHandlerMiddleware();
      const res = { response: {}, event: EVENT_MOCK };
      await middleware.after(res);
      expect(res.response).toEqual({ statusCode: 200 });
    });
  });

  describe('customMiddlewareOnError', () => {
    const EVENT_MOCK = { logger: { error: jest.fn() } };

    test('should customMiddlewareOnError with statusCode', async () => {
      const middleware = httpErrorHandlerMiddleware();
      const error = { message: 'message', statusCode: 500 };

      const res = await middleware.onError({ error, context: 'context', traceId: 'traceId', event: EVENT_MOCK });

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

      const res = await middleware.onError({ error, context: 'context', traceId: 'traceId', event: EVENT_MOCK });
      expect(res).toEqual({
        statusCode: 500,
        body: '{"error":{"message":"Internal Server Error."},"statusCode":500}',
        headers: { 'Content-Type': 'application/json' },
        isBase64Encoded: false,
      });
    });
  });
});
