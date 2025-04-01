/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { deleteAccountUserDelete } from '../fn/user/delete-account-user-delete';
import { DeleteAccountUserDelete$Params } from '../fn/user/delete-account-user-delete';

@Injectable({ providedIn: 'root' })
export class UserService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `deleteAccountUserDelete()` */
  static readonly DeleteAccountUserDeletePath = '/user';

  /**
   * Delete Account.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `deleteAccountUserDelete()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteAccountUserDelete$Response(params?: DeleteAccountUserDelete$Params, context?: HttpContext): Observable<StrictHttpResponse<'OK' | 'ERROR'>> {
    return deleteAccountUserDelete(this.http, this.rootUrl, params, context);
  }

  /**
   * Delete Account.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `deleteAccountUserDelete$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteAccountUserDelete(params?: DeleteAccountUserDelete$Params, context?: HttpContext): Observable<'OK' | 'ERROR'> {
    return this.deleteAccountUserDelete$Response(params, context).pipe(
      map((r: StrictHttpResponse<'OK' | 'ERROR'>): 'OK' | 'ERROR' => r.body)
    );
  }

}
