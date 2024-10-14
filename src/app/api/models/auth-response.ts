import { MinimalUser } from '../models/minimal-user';
export interface AuthResponse {
  someExampleData?: null | string;
  token: string;
  user: MinimalUser;
}
