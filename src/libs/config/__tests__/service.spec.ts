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

    test('should throw env not found error', () => {
      expect(() => service.get('DUMMY' as Secrets)).toThrowError(`DUMMY is not defined in environment variables`);
    });
  });
});
