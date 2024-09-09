/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { StravaAuthResponse } from '../../models/strava-auth-response';

export interface AuthenticateAuthenticate$Params {
  code: string;
}

export function authenticateAuthenticate(http: HttpClient, rootUrl: string, params: AuthenticateAuthenticate$Params, context?: HttpContext): Observable<StrictHttpResponse<StravaAuthResponse>> {
  const rb = new RequestBuilder(rootUrl, authenticateAuthenticate.PATH, 'get');
  if (params) {
    rb.query('code', params.code, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<StravaAuthResponse>;
    })
  );
}

authenticateAuthenticate.PATH = '/authenticate';
