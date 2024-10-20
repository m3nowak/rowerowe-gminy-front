/* tslint:disable */
/* eslint-disable */
export interface AuthRequest {
  code: string;
  rememberLonger?: boolean;
  scopes: Array<'read' | 'read_all' | 'profile:read_all' | 'profile:write' | 'activity:read' | 'activity:read_all' | 'activity:write'>;
}
