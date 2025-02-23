import { inject, Injectable } from '@angular/core';
import { ActivitiesService as ApiActivitiesService } from '../api/services';
import { DateTime } from 'luxon';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  apiActivitiesSvc = inject(ApiActivitiesService);

  triggerBacklog(dateFrom: DateTime<true>): Observable<void> {
    return this.apiActivitiesSvc.backlogActivitiesBacklogPost({ body: { periodFrom: dateFrom.toUTC().toISO(), periodTo: DateTime.now().toUTC().toISO() } }).pipe(
      map(() => {
        return;
      }),
    );
  }
}
