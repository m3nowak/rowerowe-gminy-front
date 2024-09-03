import { inject, Injectable } from '@angular/core';
import { BordersService } from './borders.service';
import { map, Observable, tap } from 'rxjs';
import { NGXLogger, CustomNGXLoggerService } from 'ngx-logger';
import { FeatureCollection } from 'geojson';
import { NamedFeatureCollection } from '../models/geo-ext';

@Injectable({
  providedIn: 'root',
})
export class GeoFeatureDataService {
  bordersSvc = inject(BordersService);
  loggerSvc = inject(CustomNGXLoggerService).getNewInstance({
    partialConfig: { context: 'GeoFeatureDataService' },
  });

  unlockedFeatures = new Set(['02', '3013', '3004', '3011', '3005032', '0812013', '0662011', '3022', '1606']);

  featureCollection$: Observable<NamedFeatureCollection> = this.bordersSvc.allBorders().pipe(
    map((fc) => {
      let features = fc.features.map((f) => {
        let isUnlocked = this.unlockedFeatures.has(f.properties!['TERYT']);
        f.properties = { ...f.properties, isUnlocked };
        return f;
      });
      return { name: 'demo', features: { ...fc, features } };
    }),
    tap((fc) => {
      this.loggerSvc.info(`${fc.features.features.length} features loaded`);
    })
  );
}
