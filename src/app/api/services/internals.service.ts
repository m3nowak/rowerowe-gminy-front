/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { hcHcHandler } from '../fn/internals/hc-hc-handler';
import { HcHcHandler$Params } from '../fn/internals/hc-hc-handler';
import { RateLimitSet } from '../models/rate-limit-set';
import { rateLimitsRateLimitsHandler } from '../fn/internals/rate-limits-rate-limits-handler';
import { RateLimitsRateLimitsHandler$Params } from '../fn/internals/rate-limits-rate-limits-handler';

@Injectable({ providedIn: 'root' })
export class InternalsService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `hcHcHandler()` */
  static readonly HcHcHandlerPath = '/hc';

  /**
   * HcHandler.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `hcHcHandler()` instead.
   *
   * This method doesn't expect any request body.
   */
  hcHcHandler$Response(params?: HcHcHandler$Params, context?: HttpContext): Observable<StrictHttpResponse<string>> {
    return hcHcHandler(this.http, this.rootUrl, params, context);
  }

  /**
   * HcHandler.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `hcHcHandler$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  hcHcHandler(params?: HcHcHandler$Params, context?: HttpContext): Observable<string> {
    return this.hcHcHandler$Response(params, context).pipe(
      map((r: StrictHttpResponse<string>): string => r.body)
    );
  }

  /** Path part for operation `rateLimitsRateLimitsHandler()` */
  static readonly RateLimitsRateLimitsHandlerPath = '/rate-limits';

  /**
   * RateLimitsHandler.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `rateLimitsRateLimitsHandler()` instead.
   *
   * This method doesn't expect any request body.
   */
  rateLimitsRateLimitsHandler$Response(params?: RateLimitsRateLimitsHandler$Params, context?: HttpContext): Observable<StrictHttpResponse<(null | RateLimitSet)>> {
    return rateLimitsRateLimitsHandler(this.http, this.rootUrl, params, context);
  }

  /**
   * RateLimitsHandler.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `rateLimitsRateLimitsHandler$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  rateLimitsRateLimitsHandler(params?: RateLimitsRateLimitsHandler$Params, context?: HttpContext): Observable<(null | RateLimitSet)> {
    return this.rateLimitsRateLimitsHandler$Response(params, context).pipe(
      map((r: StrictHttpResponse<(null | RateLimitSet)>): (null | RateLimitSet) => r.body)
    );
  }

}
