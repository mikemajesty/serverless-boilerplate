import { APIGatewayProxyResult } from 'aws-lambda';

export interface IMiddlewareAdapter {
  before(request): Promise<void>;
  after(request): Promise<void>;
  onError(request): Promise<APIGatewayProxyResult>;
}
