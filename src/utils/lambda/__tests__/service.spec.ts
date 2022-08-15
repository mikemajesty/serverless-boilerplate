import { setMock } from '@utils/test';

import { LambdaService } from '../service';

describe('LambdaService', () => {
  describe('formatJSONResponse', () => {
    test('should formatJSONResponse successfully with statusCode', () => {
      expect(LambdaService.formatJSONResponse({ statusCode: 200, data: { ok: true } })).toEqual({
        body: '{"statusCode":200,"data":{"ok":true}}',
        statusCode: 200,
      });
    });

    test('should formatJSONResponse successfully without statusCode', () => {
      expect(LambdaService.formatJSONResponse({ data: { ok: true } })).toEqual({
        body: '{"data":{"ok":true}}',
        statusCode: 200,
      });
    });
  });

  describe('formatPartialResponse', () => {
    test('should formatPartialResponse with traceId', () => {
      const model = { traceId: 'traceId', dummy: 'dummy' };
      expect(LambdaService.formatPartialResponse(model)).toEqual({ traceId: 'traceId' });
    });

    test('should formatPartialResponse without traceId', () => {
      const model = { dummy: 'dummy' };
      expect(LambdaService.formatPartialResponse(model)).toEqual({});
    });
  });

  describe('handlerPath', () => {
    test('should handlerPath successfully', () => {
      process.cwd = jest.fn().mockReturnValue(__dirname);
      expect(LambdaService.handlerPath(__dirname)).toEqual('');
    });
  });

  describe('middyfy', () => {
    test('should middyfy successfully', () => {
      expect(LambdaService.middyfy(setMock(() => jest.fn()))).toBeDefined();
    });
  });
});
