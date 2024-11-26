/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { RateLimitSet } from '../../models/rate-limit-set';

export interface RateLimitsRateLimitsHandler$Params {
}

export function rateLimitsRateLimitsHandler(http: HttpClient, rootUrl: string, params?: RateLimitsRateLimitsHandler$Params, context?: HttpContext): Observable<StrictHttpResponse<(null | RateLimitSet)>> {
  const rb = new RequestBuilder(rootUrl, rateLimitsRateLimitsHandler.PATH, 'get');
  if (params) {
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<(null | RateLimitSet)>;
    })
  );
}

rateLimitsRateLimitsHandler.PATH = '/rate-limits';
