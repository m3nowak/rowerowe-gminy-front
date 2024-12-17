/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { loginLoginPost } from '../fn/auth/login-login-post';
import { LoginLoginPost$Params } from '../fn/auth/login-login-post';
import { LoginResponse } from '../models/login-response';

@Injectable({ providedIn: 'root' })
export class AuthService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `loginLoginPost()` */
  static readonly LoginLoginPostPath = '/login';

  /**
   * Login.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `loginLoginPost()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  loginLoginPost$Response(params: LoginLoginPost$Params, context?: HttpContext): Observable<StrictHttpResponse<LoginResponse>> {
    return loginLoginPost(this.http, this.rootUrl, params, context);
  }

  /**
   * Login.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `loginLoginPost$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  loginLoginPost(params: LoginLoginPost$Params, context?: HttpContext): Observable<LoginResponse> {
    return this.loginLoginPost$Response(params, context).pipe(
      map((r: StrictHttpResponse<LoginResponse>): LoginResponse => r.body)
    );
  }

}
