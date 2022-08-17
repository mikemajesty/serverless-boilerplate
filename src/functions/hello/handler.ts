import { LambdaService, ValidatedEventAPIGatewayProxyEvent } from '@utils/lambda';
import { errorMiddleware } from '@utils/middlewares/error';

import schema from './schema';

const hello: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const message = `Hello ${event.body.name}, welcome to the exciting Serverless world!`;

  return LambdaService.formatJSONResponse({
    data: { message },
    ...LambdaService.formatPartialResponse(event),
  });
};

export const main = LambdaService.middyfy(hello).use(errorMiddleware());
