/* tslint:disable */
/* eslint-disable */
import { RateLimit } from '../models/rate-limit';
export interface RateLimitSet {
  any15M: RateLimit;
  anyDaily: RateLimit;
  read15M: RateLimit;
  readDaily: RateLimit;
  updatedAt: string;
}
