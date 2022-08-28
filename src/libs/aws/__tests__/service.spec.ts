import { AWSService } from '../service';

class AWSServiceDummy extends AWSService {}

describe('AWSService', () => {
  let service: AWSServiceDummy;

  beforeEach(() => {
    service = new AWSServiceDummy();
  });

  test('should be defined', () => {
    expect(service.AWS).toBeDefined();
  });
});
