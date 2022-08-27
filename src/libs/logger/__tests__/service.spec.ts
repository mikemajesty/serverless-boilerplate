import { ApiException } from '@utils/exception';
import { setMock } from '@utils/test';

import { ILoggerAdapter } from '../adapter';
import { LoggerService } from '../service';

describe('LoggerService', () => {
  let loggerService: ILoggerAdapter;
  beforeEach(() => {
    loggerService = new LoggerService();

    loggerService.httpLogger = setMock({
      logger: {
        error: jest.fn(),
        warn: jest.fn(),
        debug: jest.fn(),
        info: jest.fn(),
        trace: jest.fn(),
        fatal: jest.fn(),
        bindings: () => true,
        setBindings: () => true,
      },
    });
  });

  describe('connect', () => {
    test('should connect successfully', () => {
      const connection = loggerService.connect('trace');
      expect(connection).toHaveProperty('app');
    });

    test('should connect successfully with default value', () => {
      const connection = loggerService.connect();
      expect(connection).toHaveProperty('app');
    });
  });

  describe('info', () => {
    test('should info successfully with all parameters', () => {
      loggerService.info({
        message: 'message',
        context: 'context',
        obj: { key: 'value' },
      });

      expect(loggerService.httpLogger.logger.info).toHaveBeenCalled();
    });

    test('should info successfully with no obj', () => {
      loggerService.info({
        message: 'message',
      });

      expect(loggerService.httpLogger.logger.info).toHaveBeenCalled();
    });
  });

  describe('debug', () => {
    test('should debug successfully with all parameters', () => {
      loggerService.debug({ message: 'message', obj: { key: 'value' }, context: 'context' });

      expect(loggerService.httpLogger.logger.debug).toHaveBeenCalled();
    });

    test('should debug successfully with no obj and context', () => {
      loggerService.debug({ message: 'message' });

      expect(loggerService.httpLogger.logger.debug).toHaveBeenCalled();
    });
  });

  describe('trace', () => {
    test('should trace successfully with all parameters', () => {
      loggerService.trace('message');

      expect(loggerService.httpLogger.logger.trace).toHaveBeenCalled();
    });
  });

  describe('error', () => {
    test('should error successfully with all parameters', () => {
      loggerService.error(new ApiException('error', 500, 'context'), 'error', 'context');
      expect(loggerService.httpLogger.logger.error).toHaveBeenCalled();
    });

    test('should error successfully with no status', () => {
      loggerService.error(new Error('error'));
      expect(loggerService.httpLogger.logger.error).toHaveBeenCalled();
    });
  });

  describe('fatal', () => {
    test('should fatal successfully with all parameters', () => {
      loggerService.fatal(new ApiException('error', 500, 'context'), 'error', 'context');
      expect(loggerService.httpLogger.logger.fatal).toHaveBeenCalled();
    });

    test('should fatal successfully with no status', () => {
      loggerService.fatal(new Error('error'));
      expect(loggerService.httpLogger.logger.fatal).toHaveBeenCalled();
    });
  });

  describe('warn', () => {
    test('should warn successfully with all parameters', () => {
      loggerService.warn({
        message: 'message',
        context: 'context',
        obj: { key: 'value' },
      });

      expect(loggerService.httpLogger.logger.warn).toHaveBeenCalled();
    });

    test('should warn successfully with no obj', () => {
      loggerService.warn({
        message: 'message',
      });

      expect(loggerService.httpLogger.logger.warn).toHaveBeenCalled();
    });
  });

  describe('getPinoConfig', () => {
    test('should getPinoConfig successfully', () => {
      const pinoConfig = setMock(loggerService.getPinoConfig());
      expect(pinoConfig.messageFormat({ mock: 'mock' }, 'mock')).toBeDefined();
    });

    test('should customPrettifiers successfully', () => {
      const pinoConfig = setMock(loggerService.getPinoConfig());
      expect(pinoConfig.customPrettifiers.time()).toBeDefined();
    });
  });

  describe('getPinoHttpConfig', () => {
    test('should getPinoConfig successfully', () => {
      const pinoConfig = setMock(loggerService.getPinoHttpConfig(loggerService.httpLogger.logger));

      const res = pinoConfig.customSuccessMessage({ statusCode: 200 });

      expect(res).toBeDefined();
    });

    test('should getPinoConfig successfully with status 412', () => {
      const pinoConfig = setMock(loggerService.getPinoHttpConfig(loggerService.httpLogger.logger));

      const res = pinoConfig.customSuccessMessage({ statusCode: 412 });
      expect(res).toBeDefined();
    });

    test('should getPinoConfig successfully with status 400', () => {
      const pinoConfig = setMock(loggerService.getPinoHttpConfig(loggerService.httpLogger.logger));

      const res = pinoConfig.customSuccessMessage({ statusCode: 400 });
      expect(res).toBeDefined();
    });

    describe('customErrorMessage', () => {
      test('should customErrorMessage successfully', () => {
        const pinoConfig = setMock(loggerService.getPinoHttpConfig(loggerService.httpLogger.logger));

        const res = pinoConfig.customErrorMessage(new Error('error'), {
          statusCode: 200,
        });

        expect(res).toBeDefined();
      });
    });

    describe('genReqId', () => {
      test('should genReqId successfully', () => {
        const pinoConfig = setMock(loggerService.getPinoHttpConfig(loggerService.httpLogger.logger));

        const res = pinoConfig.genReqId({ event: { headers: { traceId: 'traceId' } } });

        expect(res).toEqual('traceId');
      });
    });

    describe('serializers', () => {
      test('should serializer error successfully', () => {
        const pinoConfig = setMock(loggerService.getPinoHttpConfig(loggerService.httpLogger.logger));

        const res = pinoConfig.serializers.err();

        expect(res).toBeUndefined();
      });

      test('should serializer req successfully', () => {
        const pinoConfig = setMock(loggerService.getPinoHttpConfig(loggerService.httpLogger.logger));

        const req = {
          method: 'GET',
          url: 'teste',
          headers: { traceId: '12', host: 'teste' },
          params: {},
          raw: { protocol: 'http', body: {} },
        };
        const res = pinoConfig.serializers.req(req);

        expect(res).toEqual(req);
      });
    });

    describe('customProps', () => {
      test('should customProps successfully', () => {
        const pinoConfig = setMock(loggerService.getPinoHttpConfig(loggerService.httpLogger.logger));

        const res = pinoConfig.customProps({
          context: 'context',
          headers: { traceId: '12' },
          protocol: 'http',
        });
        expect(res).toHaveProperty('functionName');
        expect(res).toHaveProperty('path');
        expect(res).toHaveProperty('timestamp');
        expect(res).toHaveProperty('traceId');
      });

      test('should customProps successfully with no traceId', () => {
        const pinoConfig = setMock(loggerService.getPinoHttpConfig(loggerService.httpLogger.logger));

        const res = pinoConfig.customProps({
          context: 'context',
          headers: {},
          id: '12',
          protocol: 'http',
        });

        expect(res).toHaveProperty('functionName');
        expect(res).toHaveProperty('path');
        expect(res).toHaveProperty('timestamp');
        expect(res).toHaveProperty('traceId');
      });
    });

    describe('customLogLevel', () => {
      test('should customLogLevel successfully with status > 400', () => {
        const pinoConfig = setMock(loggerService.getPinoHttpConfig(loggerService.httpLogger.logger));

        expect(pinoConfig.customLogLevel({ statusCode: 404 }, null)).toEqual('error');
      });

      test('should customLogLevel successfully with error', () => {
        const pinoConfig = setMock(loggerService.getPinoHttpConfig(loggerService.httpLogger.logger));

        expect(pinoConfig.customLogLevel({ statusCode: null }, new Error('Error'))).toEqual('error');
      });

      test('should customLogLevel successfully with status beteween success and error', () => {
        const pinoConfig = setMock(loggerService.getPinoHttpConfig(loggerService.httpLogger.logger));

        expect(pinoConfig.customLogLevel({ statusCode: 300 })).toEqual('silent');
      });

      test('should customLogLevel successfully', () => {
        const pinoConfig = setMock(loggerService.getPinoHttpConfig(loggerService.httpLogger.logger));

        expect(pinoConfig.customLogLevel({ statusCode: 200 })).toEqual('info');
      });
    });
  });
});
