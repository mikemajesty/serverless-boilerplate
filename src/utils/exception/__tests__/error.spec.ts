import { ApiException } from '../exception';
import { HttpStatus } from '../status';

describe('ApiException', () => {
  test('should get status sucessfully', () => {
    const error = new ApiException('error', HttpStatus.INTERNAL_SERVER_ERROR, 'context');
    expect(error.getStatus()).toEqual(500);
  });

  test('should getResponse status sucessfully', () => {
    const error = new ApiException('error', HttpStatus.NOT_FOUND, 'context');
    expect(error.getResponse()).toEqual({ message: 'error', statusCode: 404 });
  });

  test('should throw error wuthout status', () => {
    const error = new ApiException('error');
    error.code = '500';
    expect(error.getResponse()).toEqual({ message: 'error', statusCode: 500 });
  });
});
