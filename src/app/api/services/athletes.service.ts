/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { AthleteDetail } from '../models/athlete-detail';
import { getLoggedInUserAthletesMeGet } from '../fn/athletes/get-logged-in-user-athletes-me-get';
import { GetLoggedInUserAthletesMeGet$Params } from '../fn/athletes/get-logged-in-user-athletes-me-get';

@Injectable({ providedIn: 'root' })
export class AthletesService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `getLoggedInUserAthletesMeGet()` */
  static readonly GetLoggedInUserAthletesMeGetPath = '/athletes/me';

  /**
   * Get Logged In User.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getLoggedInUserAthletesMeGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  getLoggedInUserAthletesMeGet$Response(params?: GetLoggedInUserAthletesMeGet$Params, context?: HttpContext): Observable<StrictHttpResponse<AthleteDetail>> {
    return getLoggedInUserAthletesMeGet(this.http, this.rootUrl, params, context);
  }

  /**
   * Get Logged In User.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getLoggedInUserAthletesMeGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getLoggedInUserAthletesMeGet(params?: GetLoggedInUserAthletesMeGet$Params, context?: HttpContext): Observable<AthleteDetail> {
    return this.getLoggedInUserAthletesMeGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<AthleteDetail>): AthleteDetail => r.body)
    );
  }

}
