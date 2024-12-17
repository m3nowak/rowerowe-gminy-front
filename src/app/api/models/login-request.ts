/* tslint:disable */
/* eslint-disable */
import { StravaScopes } from '../models/strava-scopes';
export interface LoginRequest {
  code: string;
  rememberLonger?: boolean;
  scopes: Array<StravaScopes>;
}
