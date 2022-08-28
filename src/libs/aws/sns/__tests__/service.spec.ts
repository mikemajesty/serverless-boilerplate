import { setMock } from '@utils/test';
import AWS from 'aws-sdk';

import { SNSService } from '../service';

describe('SNSService', () => {
  describe('publish', () => {
    let service: SNSService;

    beforeEach(() => {
      service = new SNSService(setMock({ info: jest.fn() }));
    });

    test('should publish successfully', async () => {
      jest.spyOn(AWS, 'SNS').mockImplementation(() =>
        setMock({
          publish: () => ({
            promise: () => true,
          }),
        }),
      );

      await expect(service.publish({ Message: 'dummy', TopicArn: 'dummy' })).resolves.toEqual(true);
    });

    test('should throw publish error', async () => {
      jest.spyOn(AWS, 'SNS').mockImplementation(() =>
        setMock({
          publish: () => ({
            promise: () => {
              throw new Error('publish error');
            },
          }),
        }),
      );

      await expect(service.publish({ Message: 'dummy', TopicArn: 'dummy' })).rejects.toEqual(Error('publish error'));
    });
  });
});
