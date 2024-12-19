/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { UnlockedRegion } from '../../models/unlocked-region';

export interface UnlockedRegionsUnlockedGet$Params {
}

export function unlockedRegionsUnlockedGet(http: HttpClient, rootUrl: string, params?: UnlockedRegionsUnlockedGet$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<UnlockedRegion>>> {
  const rb = new RequestBuilder(rootUrl, unlockedRegionsUnlockedGet.PATH, 'get');
  if (params) {
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Array<UnlockedRegion>>;
    })
  );
}

unlockedRegionsUnlockedGet.PATH = '/regions/unlocked';
