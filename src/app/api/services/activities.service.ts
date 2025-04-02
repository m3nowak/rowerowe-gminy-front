/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { backlogActivitiesBacklogPost } from '../fn/activities/backlog-activities-backlog-post';
import { BacklogActivitiesBacklogPost$Params } from '../fn/activities/backlog-activities-backlog-post';

@Injectable({ providedIn: 'root' })
export class ActivitiesService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `backlogActivitiesBacklogPost()` */
  static readonly BacklogActivitiesBacklogPostPath = '/activities/backlog';

  /**
   * Backlog.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `backlogActivitiesBacklogPost()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   *
   * @deprecated
   */
  backlogActivitiesBacklogPost$Response(params: BacklogActivitiesBacklogPost$Params, context?: HttpContext): Observable<StrictHttpResponse<string>> {
    return backlogActivitiesBacklogPost(this.http, this.rootUrl, params, context);
  }

  /**
   * Backlog.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `backlogActivitiesBacklogPost$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   *
   * @deprecated
   */
  backlogActivitiesBacklogPost(params: BacklogActivitiesBacklogPost$Params, context?: HttpContext): Observable<string> {
    return this.backlogActivitiesBacklogPost$Response(params, context).pipe(
      map((r: StrictHttpResponse<string>): string => r.body)
    );
  }

}
