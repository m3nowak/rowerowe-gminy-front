import { computed, effect, inject, Injectable } from '@angular/core';
import { BordersService } from './borders.service';
import { CustomNGXLoggerService } from 'ngx-logger';
import { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';
import { AuthService } from './auth.service';
import { RegionsService } from './regions.service';

@Injectable({
  providedIn: 'root',
})
export class GeoFeatureDataService {
  bordersSvc = inject(BordersService);
  authSvc = inject(AuthService);
  regionsSvc = inject(RegionsService);
  loggerSvc = inject(CustomNGXLoggerService).getNewInstance({
    partialConfig: { context: 'GeoFeatureDataService' },
  });

  unlockedFeaturesDefault = new Set([]);

  borderInfoExt = computed<FeatureCollection<Geometry, GeoJsonProperties> | undefined>(() => {
    let unlockedFeatures = this.regionsSvc.currentUnlockedRegions();
    if (!unlockedFeatures) {
      unlockedFeatures = this.unlockedFeaturesDefault;
    }
    const allBorders = this.bordersSvc.borderInfo();
    if (allBorders) {
      const features_ext = allBorders.features.map((f) => {
        const unlockedArea = unlockedFeatures.has(f.properties!['ID']) ? 'Y' : 'N';

        return {
          ...f,
          properties: {
            ...f.properties,
            unlockedArea,
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
