import { LoggerService } from '@libs/logger';
import { setMock } from '@utils/test';

import { main } from '../handler';

describe('main', () => {
  test('should main successfully', async () => {
    const event = {
      body: { name: 'dummy' },
      headers: {},
    };

    const response = await main(event, setMock({}));

    expect(response).toHaveProperty('body');
    expect(response).toHaveProperty('headers');
    expect(response).toHaveProperty('isBase64Encoded');
    expect(response).toHaveProperty('statusCode');
  });

  test('should return traceId error', async () => {
    const event = {};

    // exclude message console
    jest.spyOn(LoggerService, 'error').mockReturnValue(null);

    await expect(main(event, setMock({}))).resolves.toEqual({
      body: '{"error":{"message":"Cannot read property \'name\' of undefined"},"statusCode":500}',
      headers: { 'Content-Type': 'application/json' },
      isBase64Encoded: false,
      statusCode: 500,
    });
  });
});
