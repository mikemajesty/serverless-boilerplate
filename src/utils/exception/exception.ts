import { HttpStatus } from './status';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Response = any;

export class ApiException extends Error {
  traceId: string;
  statusCode: number;
  code?: string;
  config?: unknown;
  user?: string;
  ctx?: string;

  getStatus() {
    return [this.statusCode, this.code].find(Boolean);
  }

  getResponse() {
    return {
      statusCode: this.getStatus(),
      message: this.message,
    };
  }

  constructor(error: Response, status?: HttpStatus, private readonly context?: string) {
    const err = [error, error.message].find(Boolean);
    super(err);
    this.message = err;
    this.name = ApiException.name;
    this.statusCode = [status, Number(this.getStatus()), HttpStatus.INTERNAL_SERVER_ERROR].find(Boolean);

    if (this.context) {
      this.ctx = this.context;
    }
  }
}
