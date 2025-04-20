/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { deleteAccountUserDelete } from '../fn/user/delete-account-user-delete';
import { DeleteAccountUserDelete$Params } from '../fn/user/delete-account-user-delete';
import { getUserSettingsUserSettingsGet } from '../fn/user/get-user-settings-user-settings-get';
import { GetUserSettingsUserSettingsGet$Params } from '../fn/user/get-user-settings-user-settings-get';
import { updateUserSettingsUserSettingsPatch } from '../fn/user/update-user-settings-user-settings-patch';
import { UpdateUserSettingsUserSettingsPatch$Params } from '../fn/user/update-user-settings-user-settings-patch';
import { UserSettings } from '../models/user-settings';

@Injectable({ providedIn: 'root' })
export class UserService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `deleteAccountUserDelete()` */
  static readonly DeleteAccountUserDeletePath = '/user';

  /**
   * Delete Account.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `deleteAccountUserDelete()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteAccountUserDelete$Response(params?: DeleteAccountUserDelete$Params, context?: HttpContext): Observable<StrictHttpResponse<'OK' | 'ERROR'>> {
    return deleteAccountUserDelete(this.http, this.rootUrl, params, context);
  }

  /**
   * Delete Account.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `deleteAccountUserDelete$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteAccountUserDelete(params?: DeleteAccountUserDelete$Params, context?: HttpContext): Observable<'OK' | 'ERROR'> {
    return this.deleteAccountUserDelete$Response(params, context).pipe(
      map((r: StrictHttpResponse<'OK' | 'ERROR'>): 'OK' | 'ERROR' => r.body)
    );
  }

  /** Path part for operation `getUserSettingsUserSettingsGet()` */
  static readonly GetUserSettingsUserSettingsGetPath = '/user/settings';

  /**
   * Get User Settings.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getUserSettingsUserSettingsGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  getUserSettingsUserSettingsGet$Response(params?: GetUserSettingsUserSettingsGet$Params, context?: HttpContext): Observable<StrictHttpResponse<UserSettings>> {
    return getUserSettingsUserSettingsGet(this.http, this.rootUrl, params, context);
  }

  /**
   * Get User Settings.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getUserSettingsUserSettingsGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getUserSettingsUserSettingsGet(params?: GetUserSettingsUserSettingsGet$Params, context?: HttpContext): Observable<UserSettings> {
    return this.getUserSettingsUserSettingsGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<UserSettings>): UserSettings => r.body)
    );
  }

  /** Path part for operation `updateUserSettingsUserSettingsPatch()` */
  static readonly UpdateUserSettingsUserSettingsPatchPath = '/user/settings';

  /**
   * Update User Settings.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `updateUserSettingsUserSettingsPatch()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  updateUserSettingsUserSettingsPatch$Response(params: UpdateUserSettingsUserSettingsPatch$Params, context?: HttpContext): Observable<StrictHttpResponse<'OK' | 'ERROR'>> {
    return updateUserSettingsUserSettingsPatch(this.http, this.rootUrl, params, context);
  }

  /**
   * Update User Settings.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `updateUserSettingsUserSettingsPatch$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  updateUserSettingsUserSettingsPatch(params: UpdateUserSettingsUserSettingsPatch$Params, context?: HttpContext): Observable<'OK' | 'ERROR'> {
    return this.updateUserSettingsUserSettingsPatch$Response(params, context).pipe(
      map((r: StrictHttpResponse<'OK' | 'ERROR'>): 'OK' | 'ERROR' => r.body)
    );
  }

}
