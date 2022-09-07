import { Options, validate, ValidatorResult } from 'jsonschema';

import { ApiException, HttpStatus } from './exception';

export default (body: unknown, schema: unknown, options?: Options): ValidatorResult => {
  const isValid = validate(body, schema, options);

  if (isValid.errors.length) {
    throw new ApiException(
      isValid.errors.map((e) => `${e.path} ${e.message}`.trim()).join(', '),
      HttpStatus.PRECONDITION_FAILED,
      'invalid-body',
    );
  }

  return isValid;
};
