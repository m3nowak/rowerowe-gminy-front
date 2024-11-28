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
    'PL0201011',
    'PL0201022',
    'PL0201052',
    'PL0203011',
    'PL0203022',
    'PL0204013',
    'PL0204032',
    'PL0204043',
    'PL0206011',
    'PL0206021',
    'PL0206031',
    'PL0206041',
    'PL0206052',
    'PL0206072',
    'PL0206082',
    'PL0207042',
    'PL0213022',
    'PL0213033',
    'PL0214011',
    'PL0214032',
    'PL0214062',
    'PL0219021',
    'PL0219043',
    'PL0219083',
    'PL0220042',
    'PL0220063',
    'PL0221072',
    'PL0223022',
    'PL0223043',
    'PL0223062',
    'PL0225021',
    'PL0261011',
    'PL0264011',
    'PL0801011',
    'PL0802011',
    'PL0802052',
    'PL0804011',
    'PL0804043',
    'PL0804052',
    'PL0804073',
    'PL0810053',
    'PL0810073',
    'PL0810092',
    'PL0811011',
    'PL0812013',
    'PL0812023',
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
    'PL2416021',
    'PL2416063',
    'PL2416073',
    'PL2416083',
    'PL2416102',
    'PL2602072',
    'PL2613012',
    'PL2613052',
    'PL3017011',
    'PL3017033',
    'PL3017042',
    'PL3017052',
  ]);

  borderInfoExt = computed<FeatureCollection<Geometry, GeoJsonProperties> | undefined>(() => {
    const featuresSimplified = this.unlockedFeatures; //new Set(Array.from(this.unlockedFeatures).map((id) => id.replace('PL', '')));
    const allBorders = this.bordersSvc.borderInfo();
    if (allBorders) {
      const features_ext = allBorders.features.map((f) => {
        const unlockedArea = featuresSimplified.has(f.properties!['ID']) ? 'Y' : 'N';

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
