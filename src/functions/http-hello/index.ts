import { LambdaService } from '@utils/lambda';

import schema from './schema';

export default {
  handler: `${LambdaService.handlerPath(__dirname)}/handler.helloHandler`,
  events: [
    {
      http: {
        method: 'post',
        path: 'hello',
        request: {
          schemas: {
            'application/json': schema,
          },
        },
      },
    },
  ],
};
