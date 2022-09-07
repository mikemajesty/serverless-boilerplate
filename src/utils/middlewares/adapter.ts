import { APIGatewayProxyResult } from 'aws-lambda';

export interface IMiddlewareAdapter {
  before(request: unknown): Promise<void>;
  after(request: unknown): Promise<void>;
  onError(request: unknown): Promise<APIGatewayProxyResult>;
}
