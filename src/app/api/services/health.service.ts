/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { healthHealthGet } from '../fn/health/health-health-get';
import { HealthHealthGet$Params } from '../fn/health/health-health-get';

@Injectable({ providedIn: 'root' })
export class HealthService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `healthHealthGet()` */
  static readonly HealthHealthGetPath = '/health';

  /**
   * Health.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `healthHealthGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  healthHealthGet$Response(params?: HealthHealthGet$Params, context?: HttpContext): Observable<StrictHttpResponse<any>> {
    return healthHealthGet(this.http, this.rootUrl, params, context);
  }

  /**
   * Health.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `healthHealthGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  healthHealthGet(params?: HealthHealthGet$Params, context?: HttpContext): Observable<any> {
    return this.healthHealthGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<any>): any => r.body)
    );
  }

}
