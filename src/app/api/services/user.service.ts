/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { apiUserUserIdUnlockedGetUserUnlocked } from '../fn/user/api-user-user-id-unlocked-get-user-unlocked';
import { ApiUserUserIdUnlockedGetUserUnlocked$Params } from '../fn/user/api-user-user-id-unlocked-get-user-unlocked';

@Injectable({ providedIn: 'root' })
export class UserService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `apiUserUserIdUnlockedGetUserUnlocked()` */
  static readonly ApiUserUserIdUnlockedGetUserUnlockedPath = '/api/user/{user_id}/unlocked';

  /**
   * GetUserUnlocked.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `apiUserUserIdUnlockedGetUserUnlocked()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiUserUserIdUnlockedGetUserUnlocked$Response(params: ApiUserUserIdUnlockedGetUserUnlocked$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<string>>> {
    return apiUserUserIdUnlockedGetUserUnlocked(this.http, this.rootUrl, params, context);
  }

  /**
   * GetUserUnlocked.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `apiUserUserIdUnlockedGetUserUnlocked$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  apiUserUserIdUnlockedGetUserUnlocked(params: ApiUserUserIdUnlockedGetUserUnlocked$Params, context?: HttpContext): Observable<Array<string>> {
    return this.apiUserUserIdUnlockedGetUserUnlocked$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<string>>): Array<string> => r.body)
    );
  }

}
