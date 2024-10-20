/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { AuthRequest } from '../../models/auth-request';
import { OAuth2Login } from '../../models/o-auth-2-login';

export interface AuthenticateLoginAuthenticateHandler$Params {
      body: AuthRequest
}

export function authenticateLoginAuthenticateHandler(http: HttpClient, rootUrl: string, params: AuthenticateLoginAuthenticateHandler$Params, context?: HttpContext): Observable<StrictHttpResponse<OAuth2Login>> {
  const rb = new RequestBuilder(rootUrl, authenticateLoginAuthenticateHandler.PATH, 'post');
  if (params) {
    rb.body(params.body, 'application/json');
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<OAuth2Login>;
    })
  );
}

authenticateLoginAuthenticateHandler.PATH = '/authenticate/login';
