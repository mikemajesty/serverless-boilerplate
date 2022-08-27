import validate from '../validate';

const schema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
  },
  required: ['name'],
} as const;

describe('validate', () => {
  test('should validate successfully', () => {
    const isValid = validate({ name: 'dummy' }, schema);
    expect(isValid.errors.length).toEqual(0);
  });

  test('should throw validate error', () => {
    expect(() => validate({ fake: 'dummy' }, schema)).toThrowError('requires property "name"');
  });
});
