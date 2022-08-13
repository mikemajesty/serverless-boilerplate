import { LambdaService, ValidatedEventAPIGatewayProxyEvent, } from '@utils/lambda';

import schema from './schema';

const hello: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const message = `Hello ${event.body.name}, welcome to the exciting Serverless world!`
  throw new Error(message);
  // return LambdaService.formatJSONResponse({
  //   message,
  //   event,
  // });
};

export const main = LambdaService.middyfy(hello);








