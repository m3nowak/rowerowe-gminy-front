import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { authenticateAuthenticateHandler } from '../fn/auth/authenticate-authenticate-handler';
import { AuthenticateAuthenticateHandler$Params } from '../fn/auth/authenticate-authenticate-handler';
import { AuthResponse } from '../models/auth-response';

@Injectable({ providedIn: 'root' })
export class AuthService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `authenticateAuthenticateHandler()` */
  static readonly AuthenticateAuthenticateHandlerPath = '/authenticate';

  /**
   * AuthenticateHandler.
   *
   * Authenticate with Strava with provided code
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `authenticateAuthenticateHandler()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  authenticateAuthenticateHandler$Response(params: AuthenticateAuthenticateHandler$Params, context?: HttpContext): Observable<StrictHttpResponse<AuthResponse>> {
    return authenticateAuthenticateHandler(this.http, this.rootUrl, params, context);
  }

  /**
   * AuthenticateHandler.
   *
   * Authenticate with Strava with provided code
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `authenticateAuthenticateHandler$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  authenticateAuthenticateHandler(params: AuthenticateAuthenticateHandler$Params, context?: HttpContext): Observable<AuthResponse> {
    return this.authenticateAuthenticateHandler$Response(params, context).pipe(map((r: StrictHttpResponse<AuthResponse>): AuthResponse => r.body));
  }
}
