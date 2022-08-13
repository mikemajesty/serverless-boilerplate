import { LoggerService } from './service';
import { ErrorType, LogLevel, MessageType } from './type';

export interface ILoggerAdapter<T> {
  httpLogger: T;
  setContext(context: string): void;
  setApplication(app: string): void;
  error(error: ErrorType, message?: string, context?: string): void;
  fatal(error: ErrorType, message?: string, context?: string): void;
  info({ message, context, obj }: MessageType): void;
  warn({ message, context, obj }: MessageType): void;
  connect(logLevel: LogLevel): LoggerService;
}
