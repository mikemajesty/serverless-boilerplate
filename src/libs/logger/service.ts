import { ApiException } from '@utils/exception';
import { DateTime } from 'luxon';
import { ServerResponse } from 'node:http';
import { Transform } from 'node:stream';
import { LevelWithSilent, Logger, multistream, pino } from 'pino';
import pinoElastic from 'pino-elasticsearch';
import { HttpLogger, pinoHttp } from 'pino-http';
import pinoPretty from 'pino-pretty';
import { v4 as uuidv4 } from 'uuid';

import { name } from '@/package.json';

import { ILoggerAdapter } from './adapter';
import { ErrorType, MessageType } from './types';

export class LoggerService implements ILoggerAdapter<HttpLogger> {
  httpLogger: HttpLogger;
  private app: string;
  private streamToElastic: Transform;

  constructor(elkURL: string, level?: LevelWithSilent) {
    this.setApplication(name);
    const index = `serverless-logs-${this.getDateFormat(new Date(), 'yyyy-MM')}`;

    this.streamToElastic = pinoElastic({
      index,
      consistency: 'one',
      node: elkURL,
      'es-version': 7,
      'flush-bytes': 1000,
    });

    this.connect(level);
  }

  setApplication(app: string): void {
    this.app = app;
  }

  trace(message: string): void {
    this.httpLogger.logger.trace(message);
  }

  info({ message, context, obj }: MessageType): void {
    this.httpLogger.logger.info({ context, ...obj }, message);
  }

  warn({ message, context, obj }: MessageType): void {
    this.httpLogger.logger.warn({ context, ...obj }, message);
  }

  debug({ message, context, obj }: MessageType): void {
    this.httpLogger.logger.debug({ context, ...obj }, message);
  }

  error(error: ErrorType, message?: string, context?: string): void {
    const errorResponse = this.getErrorResponse(error);

    const response =
      error?.name === ApiException.name
        ? { statusCode: error['statusCode'], message: error?.message }
        : errorResponse?.value();

    const model = {
      ...response,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      functionName: (error as any)?.context?.functionName,
      context: [error['context'], context].find(Boolean),
      type: error?.name,
      status: 'Error',
      traceId: this.getTraceId(error),
      timestamp: this.getDateFormat(),
      application: this.app,
      trace: error.stack,
    };

    this.httpLogger.logger.error(model, [message, error.message].find(Boolean));
  }

  fatal(error: ApiException, message?: string, context?: string): void {
    const model = {
      ...error,
      context: [error['context'], context].find(Boolean),
      type: error.name,
      status: 'Error',
      traceId: this.getTraceId(error),
      timestamp: this.getDateFormat(),
      application: this.app,
      trace: error,
    };

    this.httpLogger.logger.fatal(model, [message, error.message].find(Boolean));
    process.exit(1);
  }

  getPinoConfig() {
    return {
      colorize: true,
      levelFirst: true,
      ignore: 'pid,hostname',
      quietReqLogger: true,
      messageFormat: (log: unknown, messageKey: string) => {
        const message = log[String(messageKey)];
        return `[${this.app}}] ${message}`;
      },
      customPrettifiers: {
        time: () => {
          return `[${this.getDateFormat()}]`;
        },
      },
    };
  }

  getPinoHttpConfig(pinoLogger: Logger): unknown {
    return {
      logger: pinoLogger,
      quietReqLogger: true,
      customSuccessMessage: (res) => {
        return `request ${res.statusCode >= 400 ? 'errro' : 'success'} with status code: ${res.statusCode}`;
      },
      customErrorMessage: function (error: Error | ApiException, res: ServerResponse) {
        return `request ${error.name.toLowerCase()} with status code: ${res.statusCode} `;
      },
      genReqId: (request) => {
        return request.event.headers.traceId;
      },
      customAttributeKeys: {
        req: 'request',
        res: 'response',
        err: 'error',
        responseTime: 'timeTaken',
        reqId: 'traceId',
      },
      serializers: {
        err: (err) => pino.stdSerializers.err(err),
        req: (request) => {
          return request;
        },
        res: pino.stdSerializers.res,
      },
      customProps: (request): unknown => {
        const functionName = request.context.functionName;
        const traceId = [request.event?.headers?.traceId, request.id].find(Boolean);

        const path = request.event?.requestContext
          ? `${request.event.headers.Host}${request.event.requestContext.resourcePath}`
          : 'invoke';

        this.httpLogger.logger.setBindings({
          traceId,
          application: this.app,
          functionName: functionName,
          path,
          timestamp: this.getDateFormat(),
        });

        return {
          traceId,
          application: this.app,
          functionName: functionName,
          path,
          timestamp: this.getDateFormat(),
        };
      },
      customLogLevel: (res, error) => {
        if ([res.statusCode >= 400, error].some(Boolean)) {
          return 'error';
        }

        if ([res.statusCode >= 300, res.statusCode <= 400].every(Boolean)) {
          return 'silent';
        }

        return 'info';
      },
    };
  }

  private getErrorResponse(error) {
    const isFunction = typeof error?.getResponse === 'function';
    return [
      {
        conditional: isFunction && typeof error.getResponse() === 'string',
        value: () =>
          new ApiException(
            error.getResponse(),
            [error.getStatus(), error['status']].find(Boolean),
            error['context'],
          ).getResponse(),
      },
      {
        conditional: isFunction && typeof error.getResponse() === 'object',
        value: () => error?.getResponse(),
      },
    ].find((c) => c.conditional);
  }

  private getDateFormat(date = new Date(), format = 'yyyy-MM-dd HH:mm:ss'): string {
    return DateTime.fromJSDate(date).setZone(process.env.TZ).toFormat(format);
  }

  private getTraceId(error): string {
    if (typeof error === 'string') return uuidv4();
    return [error.traceId, this.httpLogger.logger.bindings()?.tranceId].find(Boolean);
  }

  private connect(logLevel?: LevelWithSilent) {
    const level = [logLevel, 'trace'].find(Boolean);
    const pinoLogger = pino(
      {
        useLevelLabels: true,
        level: level,
      },
      multistream([
        {
          level: 'trace',
          stream: pinoPretty(this.getPinoConfig()),
        },
        { level: 'info', stream: this.streamToElastic },
      ]),
    );

    this.httpLogger = pinoHttp(this.getPinoHttpConfig(pinoLogger));
  }
}
