import { LambdaService, ValidatedEventAPIGatewayProxyEvent, } from '@utils/lambda';
import { LoggerService } from '@libs/logger';

import schema from './schema';

const hello: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  LoggerService.warn({ message: 'Hello World' });
  return LambdaService.formatJSONResponse({
    message: `Hello ${event.body.name}, welcome to the exciting Serverless world!`,
    event,
  });
};



export const main = LambdaService.middyfy(hello);








