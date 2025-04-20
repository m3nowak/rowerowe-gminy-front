/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { UserSettingsPartial } from '../../models/user-settings-partial';

export interface UpdateUserSettingsUserSettingsPatch$Params {
      body: UserSettingsPartial
}

export function updateUserSettingsUserSettingsPatch(http: HttpClient, rootUrl: string, params: UpdateUserSettingsUserSettingsPatch$Params, context?: HttpContext): Observable<StrictHttpResponse<'OK' | 'ERROR'>> {
  const rb = new RequestBuilder(rootUrl, updateUserSettingsUserSettingsPatch.PATH, 'patch');
  if (params) {
    rb.body(params.body, 'application/json');
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<'OK' | 'ERROR'>;
    })
  );
}

updateUserSettingsUserSettingsPatch.PATH = '/user/settings';
