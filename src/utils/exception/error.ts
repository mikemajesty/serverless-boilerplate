import { HttpStatus } from './status';

type Response = any;

export class ApiException extends Error {
  traceid: string;
  statusCode: number;
  code?: string;
  config?: unknown;
  user?: string;

  getStatus() {
    return this.statusCode || this.code;
  }

  getResponse() {
    return {
      statusCode: this.statusCode,
      message: this.message,
    };
  }

  constructor(error: Response, status?: HttpStatus, private readonly context?: string) {
    super(error || error.message);
    this.message = error || error.message;
    this.statusCode = status || HttpStatus.INTERNAL_SERVER_ERROR;

    if (this.context) {
      this.context = this.context;
    }
  }
}