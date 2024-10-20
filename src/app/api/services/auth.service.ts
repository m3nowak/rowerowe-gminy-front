/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { authenticateLoginAuthenticateHandler } from '../fn/auth/authenticate-login-authenticate-handler';
import { AuthenticateLoginAuthenticateHandler$Params } from '../fn/auth/authenticate-login-authenticate-handler';
import { OAuth2Login } from '../models/o-auth-2-login';

@Injectable({ providedIn: 'root' })
export class AuthService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `authenticateLoginAuthenticateHandler()` */
  static readonly AuthenticateLoginAuthenticateHandlerPath = '/authenticate/login';

  /**
   * AuthenticateHandler.
   *
   * Authenticate with Strava with provided code
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `authenticateLoginAuthenticateHandler()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  authenticateLoginAuthenticateHandler$Response(params: AuthenticateLoginAuthenticateHandler$Params, context?: HttpContext): Observable<StrictHttpResponse<OAuth2Login>> {
    return authenticateLoginAuthenticateHandler(this.http, this.rootUrl, params, context);
  }

  /**
   * AuthenticateHandler.
   *
   * Authenticate with Strava with provided code
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `authenticateLoginAuthenticateHandler$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  authenticateLoginAuthenticateHandler(params: AuthenticateLoginAuthenticateHandler$Params, context?: HttpContext): Observable<OAuth2Login> {
    return this.authenticateLoginAuthenticateHandler$Response(params, context).pipe(
      map((r: StrictHttpResponse<OAuth2Login>): OAuth2Login => r.body)
    );
  }

}
