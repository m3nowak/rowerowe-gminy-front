import { inject, Injectable } from '@angular/core';
import { AthletesService as ApiAthleteService } from '../api/services';
import { map, Observable } from 'rxjs';
import { Athlete } from '../models/athlete';
import { DateTime } from 'luxon';

@Injectable({
  providedIn: 'root',
})
export class AthleteService {
  apiAthleteSvc = inject(ApiAthleteService);

  getCurrentAthlete(): Observable<Athlete> {
    return this.apiAthleteSvc.getLoggedInUserAthletesMeGet().pipe(
      map((response) => ({
        unprocessedActivities: response.unprocessedActivities,
        id: response.id,
        createdAt: DateTime.fromISO(response.createdAt),
        lastBacklogSync: response.lastBacklogSync
          ? DateTime.fromISO(response.lastBacklogSync)
          : undefined,
        backlogSyncEligible: response.backlogSyncEligible,
        stravaAccountCreatedAt: DateTime.fromISO(response.stravaAccountCreatedAt),
      })),
    );
  }
}
