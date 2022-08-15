import { HttpService } from '../service';

describe('HttpService', () => {
  let httpService: HttpService;

  beforeEach(() => {
    httpService = new HttpService();
  });

  describe('instance', () => {
    test('should instance successfully', () => {
      expect(httpService.instance()).toBeDefined();
    });
  });
});
