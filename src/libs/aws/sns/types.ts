import { Response } from 'aws-sdk';

export type PromiseResult<D, E> = D & { $response: Response<D, E> };
