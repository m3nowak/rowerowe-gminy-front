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

  unlockedFeatures = new Set([
    'PL0206031',
    'PL0206041',
    'PL0206052',
    'PL0206072',
    'PL0207042',
    'PL0219021',
    'PL0219043',
    'PL0219083',
    'PL0221072',
    'PL0223043',
    'PL0223062',
    'PL0261011',
    'PL0264011',
    'PL1007032',
    'PL1007062',
    'PL1010012',
    'PL1010072',
    'PL1010093',
    'PL1012102',
    'PL1012113',
    'PL1012132',
    'PL1012142',
    'PL1016011',
    'PL1016053',
    'PL1016092',
    'PL1401013',
    'PL1401022',
    'PL1401052',
    'PL1401063',
    'PL1406073',
    'PL1406083',
    'PL1406113',
    'PL1407042',
    'PL1407063',
    'PL1423043',
    'PL2404063',
    'PL2404092',
    'PL2416073',
    'PL2416083',
    'PL2416102',
    'PL2602072',
    'PL2613012',
    'PL2613052',
  ]);

  borderInfoExt = computed<FeatureCollection<Geometry, GeoJsonProperties> | undefined>(() => {
    const featuresSimplified = new Set(Array.from(this.unlockedFeatures).map((id) => id.replace('PL', '')));
    const allBorders = this.bordersSvc.borderInfo();
    if (allBorders) {
      const features_ext = allBorders.features.map((f) => {
        let unlockedArea = 'NONE';
        if (featuresSimplified.has(f.properties!['VOI_ID'])) {
          unlockedArea = 'WOJ';
        } else if (featuresSimplified.has(f.properties!['COU_ID'])) {
          unlockedArea = 'POW';
        } else if (featuresSimplified.has(f.properties!['TERYT'])) {
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
