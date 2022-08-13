import { green, red, yellow } from 'colors/safe';
import { DateTime } from 'luxon';
import { ServerResponse } from 'node:http';
import { LevelWithSilent, Logger, pino } from 'pino';
import { HttpLogger, pinoHttp } from 'pino-http';
import { multistream } from 'pino-multi-stream';
import pinoPretty from 'pino-pretty';
import { v4 as uuidv4 } from 'uuid';

import { ApiException } from '../../utils/exception/error';
import { ILoggerAdapter } from './adapter';
import { ErrorType, MessageType } from './type';
import { name } from '@/package.json';

export class LoggerService implements ILoggerAdapter<HttpLogger> {
  httpLogger: HttpLogger;
  private context: string;
  private app: string;

  constructor() {
    this.setApplication(name)
  }

  connect(logLevel?: LevelWithSilent): this {
    const pinoLogger = pino(
      {
        useLevelLabels: true,
        level: logLevel || 'trace'

      },
      multistream([
        {
          level: 'trace',
          stream: pinoPretty(this.getPinoConfig()),
        },
      ]),
    );

    this.httpLogger = pinoHttp(this.getPinoHttpConfig(pinoLogger));
    return this;
  }

  setContext(context: string): void {
    this.context = context;
  }

  setApplication(app: string): void {
    this.app = app;
  }

  info({ message, context, obj }: MessageType): void {
    const _message = green(message);

    this.setContext(context);

    if (obj) {
      this.httpLogger.logger.info(obj, _message);
      return;
    }

    this.httpLogger.logger.info(_message);
  }

  error(error: ErrorType, message?: string, context?: string): void {
    const errorResponse = this.getErrorResponse(error);

    const response =
      error?.name === ApiException.name
        ? { statusCode: error['statusCode'], message: error?.message }
        : errorResponse?.value();

    const model =
    {
      ...response,
      context: [context, this.context, error['context']['functionName'], error['context']].find(c => c),
      type: error?.name,
      traceid: this.getTraceId(error),
      timestamp: this.getDateFormat(),
      application: this.app,
      trace: error.stack.replace(/\n/g, '').replace('/', ''),
    }

    this.httpLogger.logger.error(model, red(message || error.message));
  }

  fatal(error: ErrorType, message?: string, context?: string): void {
    this.httpLogger.logger.fatal(
      {
        ...(error.getResponse() as object),
        context: context || this.context,
        type: error.name,
        traceid: this.getTraceId(error),
        timestamp: this.getDateFormat(),
        application: this.app,
        trace: error.stack.replace(/\n/g, '').replace('/', ''),
      },
      red(message || error.message),
    );
  }

  warn({ message, context, obj }: MessageType): void {
    const _message = yellow(message);

    this.setContext(context);

    if (obj) {
      this.httpLogger.logger.warn(obj, _message);
      return;
    }

    this.httpLogger.logger.warn(_message);
  }

  private getPinoConfig() {
    return {
      colorize: true,
      levelFirst: true,
      ignore: 'pid,hostname',
      quietReqLogger: true,
      messageFormat: (log: unknown, messageKey: string) => {
        const message = log[String(messageKey)];
        const context = [this.context, this.app]?.find((c: string) => c);
        if (context) return `[${context}] ${message}`;

        return `${message}`;
      },
      customPrettifiers: {
        time: () => {
          return `[${this.getDateFormat()}]`;
        },
      },
    };
  }

  private getPinoHttpConfig(pinoLogger: Logger): unknown {
    return {
      logger: pinoLogger,
      quietReqLogger: true,
      customSuccessMessage: (res) => {
        return `request ${res.statusCode >= 400 ? red('errro') : green('success')} with status code: ${res.statusCode}`;
      },
      customErrorMessage: function (error: Error, res: ServerResponse) {
        return `request ${red(error.name.toLowerCase())} with status code: ${res.statusCode} `;
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
        const context = this.context || request.context.functionName;
        request.ctx = context
        const traceid = request.event?.headers?.traceId || request.id;

        const path = request.event?.requestContext ? `${request.event.headers.Host}${request.event.requestContext.resourcePath}` : 'invoke';

        this.httpLogger.logger.setBindings({
          traceid,
          application: this.app,
          context: context,
          path,
          timestamp: this.getDateFormat(),
        });

        return {
          traceid,
          application: this.app,
          context: context,
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

  private getErrorResponse(error: ErrorType) {
    const isFunction = typeof error?.getResponse === 'function';
    return [
      {
        conditional: isFunction && typeof error.getResponse() === 'string',
        value: () =>
          new ApiException(error.getResponse(), error.getStatus() || error['status'], error['context']).getResponse(),
      },
      {
        conditional: isFunction && typeof error.getResponse() === 'object',
        value: () => error?.getResponse(),
      },
    ].find((c) => c.conditional);
  }

  private getDateFormat(date = new Date(), format = 'dd/MM/yyyy HH:mm:ss'): string {
    return DateTime.fromJSDate(date).setZone(process.env.TZ).toFormat(format);
  }

  private getTraceId(error): string {
    if (typeof error === 'string') return uuidv4();
    return [error.traceid, this.httpLogger.logger.bindings()?.tranceId].find(Boolean);
  }
}
