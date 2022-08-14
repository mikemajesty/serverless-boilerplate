import { ConfigService } from '../service';
import { Secrets } from '../types';

describe('ConfigService', () => {
  let service: ConfigService;

  beforeEach(() => {
    service = new ConfigService();
  });

  describe('get', () => {
    test('should get ENV successfully', () => {
      expect(service.get(Secrets.ENV)).toEqual('test');
    });

    test('should throw error of undefined ENV', () => {
      expect(() => service.get(Secrets.AWS_REGION)).toThrowError(
        `${Secrets.AWS_REGION} is not defined in environment variables`,
      );
    });
  });
});
