/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { AthleteDetail } from '../../models/athlete-detail';

export interface GetLoggedInUserAthletesMeGet$Params {
}

export function getLoggedInUserAthletesMeGet(http: HttpClient, rootUrl: string, params?: GetLoggedInUserAthletesMeGet$Params, context?: HttpContext): Observable<StrictHttpResponse<AthleteDetail>> {
  const rb = new RequestBuilder(rootUrl, getLoggedInUserAthletesMeGet.PATH, 'get');
  if (params) {
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<AthleteDetail>;
    })
  );
}

getLoggedInUserAthletesMeGet.PATH = '/athletes/me';
