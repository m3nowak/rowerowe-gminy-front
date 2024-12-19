/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { UnlockedRegionDetail } from '../../models/unlocked-region-detail';

export interface UnlockedDetailRegionsUnlockedRegionIdGet$Params {
  region_id: string;
}

export function unlockedDetailRegionsUnlockedRegionIdGet(http: HttpClient, rootUrl: string, params: UnlockedDetailRegionsUnlockedRegionIdGet$Params, context?: HttpContext): Observable<StrictHttpResponse<UnlockedRegionDetail>> {
  const rb = new RequestBuilder(rootUrl, unlockedDetailRegionsUnlockedRegionIdGet.PATH, 'get');
  if (params) {
    rb.path('region_id', params.region_id, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<UnlockedRegionDetail>;
    })
  );
}

unlockedDetailRegionsUnlockedRegionIdGet.PATH = '/regions/unlocked/{region_id}';
