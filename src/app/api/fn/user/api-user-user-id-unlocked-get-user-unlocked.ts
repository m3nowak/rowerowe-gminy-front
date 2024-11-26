/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';


export interface ApiUserUserIdUnlockedGetUserUnlocked$Params {
  user_id: number;
}

export function apiUserUserIdUnlockedGetUserUnlocked(http: HttpClient, rootUrl: string, params: ApiUserUserIdUnlockedGetUserUnlocked$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<string>>> {
  const rb = new RequestBuilder(rootUrl, apiUserUserIdUnlockedGetUserUnlocked.PATH, 'get');
  if (params) {
    rb.path('user_id', params.user_id, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Array<string>>;
    })
  );
}

apiUserUserIdUnlockedGetUserUnlocked.PATH = '/api/user/{user_id}/unlocked';
