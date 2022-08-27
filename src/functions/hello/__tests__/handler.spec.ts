import { LoggerService } from '@libs/logger';
import { setMock } from '@utils/test';

import { helloHandler } from '../handler';

describe('main', () => {
  test('should main successfully', async () => {
    const event = {
      body: { name: 'dummy' },
      headers: {},
    };

    const response = await helloHandler(event, setMock({}));

    expect(response).toEqual({
      body: '{"data":"Hello dummy, welcome to the exciting Serverless world!","traceId":"1"}',
      headers: { 'Content-Type': 'application/json' },
      isBase64Encoded: false,
      statusCode: 200,
    });
  });

  test('should return traceId error', async () => {
    const event = {
      headers: {},
    };

    // exclude message console
    jest.spyOn(LoggerService, 'error').mockReturnValue(null);

    await expect(helloHandler(event, setMock({}))).resolves.toEqual({
      body: '{"error":{"message":"Cannot read property \'name\' of undefined","traceId":"1"},"statusCode":500}',
      headers: { 'Content-Type': 'application/json' },
      isBase64Encoded: false,
      statusCode: 500,
    });
  });
});
