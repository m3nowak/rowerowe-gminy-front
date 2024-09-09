/* tslint:disable */
/* eslint-disable */
import { MinimalUser } from '../models/minimal-user';
export interface AuthResponse {
  token: string;
  user: MinimalUser;
}
