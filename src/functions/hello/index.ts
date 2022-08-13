import schema from './schema';
import { LambdaService } from '@utils/lambda';

export default {
  handler: `${LambdaService.handlerPath(__dirname)}/handler.main`,
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
