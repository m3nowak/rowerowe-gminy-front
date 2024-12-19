/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { unlockedDetailRegionsUnlockedRegionIdGet } from '../fn/regions/unlocked-detail-regions-unlocked-region-id-get';
import { UnlockedDetailRegionsUnlockedRegionIdGet$Params } from '../fn/regions/unlocked-detail-regions-unlocked-region-id-get';
import { UnlockedRegion } from '../models/unlocked-region';
import { UnlockedRegionDetail } from '../models/unlocked-region-detail';
import { unlockedRegionsUnlockedGet } from '../fn/regions/unlocked-regions-unlocked-get';
import { UnlockedRegionsUnlockedGet$Params } from '../fn/regions/unlocked-regions-unlocked-get';

@Injectable({ providedIn: 'root' })
export class RegionsService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `unlockedRegionsUnlockedGet()` */
  static readonly UnlockedRegionsUnlockedGetPath = '/regions/unlocked';

  /**
   * Unlocked.
   *
   * Get all the regions that the user has unlocked
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `unlockedRegionsUnlockedGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  unlockedRegionsUnlockedGet$Response(params?: UnlockedRegionsUnlockedGet$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<UnlockedRegion>>> {
    return unlockedRegionsUnlockedGet(this.http, this.rootUrl, params, context);
  }

  /**
   * Unlocked.
   *
   * Get all the regions that the user has unlocked
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `unlockedRegionsUnlockedGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  unlockedRegionsUnlockedGet(params?: UnlockedRegionsUnlockedGet$Params, context?: HttpContext): Observable<Array<UnlockedRegion>> {
    return this.unlockedRegionsUnlockedGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<UnlockedRegion>>): Array<UnlockedRegion> => r.body)
    );
  }

  /** Path part for operation `unlockedDetailRegionsUnlockedRegionIdGet()` */
  static readonly UnlockedDetailRegionsUnlockedRegionIdGetPath = '/regions/unlocked/{region_id}';

  /**
   * Unlocked Detail.
   *
   * Get the details of a specific region that the user has unlocked
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `unlockedDetailRegionsUnlockedRegionIdGet()` instead.
   *
   * This method doesn't expect any request body.
   */
  unlockedDetailRegionsUnlockedRegionIdGet$Response(params: UnlockedDetailRegionsUnlockedRegionIdGet$Params, context?: HttpContext): Observable<StrictHttpResponse<UnlockedRegionDetail>> {
    return unlockedDetailRegionsUnlockedRegionIdGet(this.http, this.rootUrl, params, context);
  }

  /**
   * Unlocked Detail.
   *
   * Get the details of a specific region that the user has unlocked
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `unlockedDetailRegionsUnlockedRegionIdGet$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  unlockedDetailRegionsUnlockedRegionIdGet(params: UnlockedDetailRegionsUnlockedRegionIdGet$Params, context?: HttpContext): Observable<UnlockedRegionDetail> {
    return this.unlockedDetailRegionsUnlockedRegionIdGet$Response(params, context).pipe(
      map((r: StrictHttpResponse<UnlockedRegionDetail>): UnlockedRegionDetail => r.body)
    );
  }

}
