import { setMock } from '@utils/test';

import { LambdaService } from '../service';

describe('LambdaService', () => {
  let service: LambdaService;
  beforeEach(() => {
    service = new LambdaService();
  });

  describe('invoke', () => {
    test('should invoke lambda successfully', async () => {
      jest.spyOn(service, 'getInstance').mockImplementation(() =>
        setMock({
          invoke: () => ({
            promise: () => true,
          }),
        }),
      );
      await expect(service.invoke({ FunctionName: 'dummy', Payload: '' })).resolves.toEqual(true);
    });

    test('should throw invoke lambda error', async () => {
      jest.spyOn(service, 'getInstance').mockImplementation(() =>
        setMock({
          invoke: () => ({
            promise: () => {
              throw new Error('invoke error');
            },
          }),
        }),
      );

      await expect(service.invoke(setMock({}))).rejects.toEqual(Error('invoke error'));
    });
  });
});
