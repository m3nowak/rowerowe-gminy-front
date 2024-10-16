import { computed, effect, inject, Injectable } from '@angular/core';
import { BordersService } from './borders.service';
import { CustomNGXLoggerService } from 'ngx-logger';
import { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';

@Injectable({
  providedIn: 'root',
})
export class GeoFeatureDataService {
  bordersSvc = inject(BordersService);
  loggerSvc = inject(CustomNGXLoggerService).getNewInstance({
    partialConfig: { context: 'GeoFeatureDataService' },
  });

  unlockedFeatures = new Set(['02', '3013', '3004', '3011', '3005032', '0812013', '0662011', '3022', '1606', '3029012']);

  borderInfoExt = computed<FeatureCollection<Geometry, GeoJsonProperties> | undefined>(() => {
    const allBorders = this.bordersSvc.borderInfo();
    if (allBorders) {
      const features_ext = allBorders.features.map((f) => {
        let unlockedArea = 'NONE';
        if (this.unlockedFeatures.has(f.properties!['VOI_ID'])) {
          unlockedArea = 'WOJ';
        } else if (this.unlockedFeatures.has(f.properties!['COU_ID'])) {
          unlockedArea = 'POW';
        } else if (this.unlockedFeatures.has(f.properties!['TERYT'])) {
          unlockedArea = 'GMI';
        }
        return {
          ...f,
          properties: {
            ...f.properties,
            unlockedArea: unlockedArea,
          },
        };
      });
      return {
        ...allBorders,
        features: features_ext,
      };
    } else {
      return undefined;
    }
  });

  logEffect = effect(() => {
    const bie = this.borderInfoExt();
    if (bie) {
      this.loggerSvc.info('Extended border info updated, feature count =', bie.features.length);
    } else {
      this.loggerSvc.info('Extended border info not available');
    }
  });
}
