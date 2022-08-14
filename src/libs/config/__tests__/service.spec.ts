import { ConfigService } from '../service';
import { Secrets } from '../types';

describe('ConfigService', () => {
  let service: ConfigService;
  beforeEach(() => {
    service = new ConfigService();
  });

  describe('get', () => {
    test('should get ENV successfully', () => {
      expect(service.get(Secrets.NODE_ENV)).toEqual('test');
    });

    test('should thorw error of undefined ENV', () => {
      expect(service.get(Secrets.AWS_REGION)).toBeUndefined();
    });
  });
});
