import { inject, Injectable } from '@angular/core';
import { RegionsService as ApiRegionsService } from '../api/services';
import { iif, map, of, switchMap } from 'rxjs';
import { AuthService } from './auth.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class RegionsService {
  apiRegionsSvc = inject(ApiRegionsService);
  authSvc = inject(AuthService);

  unlockedRegions() {
    return this.apiRegionsSvc.unlockedRegionsUnlockedGet().pipe(
      map((regions) => regions.map((region) => region.regionId)),
      map((regionIds) => new Set(regionIds)),
    );
  }

  currentUnlockedRegions = toSignal(
    toObservable(this.authSvc.currentToken).pipe(
      switchMap((token) => iif(() => !!token, this.unlockedRegions(), of(new Set<string>()))),
    ),
  );

  unlockedRegionDetail(regionId: string) {
    return this.apiRegionsSvc
      .unlockedDetailRegionsUnlockedRegionIdGet({ region_id: regionId })
      .pipe(
        map((region) => {
          return {
            id: region.regionId,
            lastVisited: region.lastVisited,
            firstVisited: region.firstVisited,
            visitedCount: region.visitedCount,
            lastActivityId: region.lastActivityId,
          };
        }),
      );
  }
}
