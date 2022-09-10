import { IAWSService } from '../adapter';
import { AWSService } from '../service';

describe('AWSService', () => {
  let service: IAWSService;

  beforeEach(() => {
    service = new AWSService();
  });

  test('should be defined', () => {
    expect(service.AWS).toBeDefined();
  });
});
