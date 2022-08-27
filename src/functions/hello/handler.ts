import { HttpEventType, LambdaService, ValidatedEventAPIGatewayProxyEvent } from '@utils/lambda';
import { httpErrorHandlerMiddleware } from '@utils/middlewares/http-error';
import { APIGatewayProxyResult } from 'aws-lambda';

import schema from './schema';

const hello: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event: HttpEventType,
): Promise<APIGatewayProxyResult> => {
  const message = `Hello ${event.body.name}, welcome to the exciting Serverless world!`;

  event.logger.debug({ message });

  return LambdaService.formatJSONResponse({
    data: message,
    ...LambdaService.formatPartialResponse(event),
  });
};

export const main = LambdaService.middyfy(hello).use(httpErrorHandlerMiddleware());
