import { Request } from 'express';

export function getUserId(request: Request<unknown>): number {
  return request['userId'];
}
