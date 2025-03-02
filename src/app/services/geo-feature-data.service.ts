import { computed, effect, inject, Injectable } from '@angular/core';
import { BordersService } from './borders.service';
import { CustomNGXLoggerService } from 'ngx-logger';
import {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
  MultiPolygon,
  Point,
  Polygon,
} from 'geojson';
import { AuthService } from './auth.service';
import { RegionsService } from './regions.service';
import { polygon, point } from '@turf/helpers';

import { distance } from '@turf/distance';
import { booleanPointInPolygon } from '@turf/boolean-point-in-polygon';
import { polygonToLine } from '@turf/polygon-to-line';
import { centerOfMass } from '@turf/center-of-mass';
import { nearestPointOnLine } from '@turf/nearest-point-on-line';
import { bbox } from '@turf/bbox';

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

  countryBorder = computed(() => {
    const borderInfo = this.bordersSvc.borderInfo();
    if (borderInfo) {
      const border = borderInfo.features.find((f) => f.properties!['ID'] === 'PL');
      if (border && border.geometry.type === 'Polygon') {
        return border as Feature<Polygon, GeoJsonProperties>;
      }
    }
    return undefined;
  });

  countryCenter = computed(() => {
    const border = this.countryBorder();
    if (border) {
      this.loggerSvc.info('Country border', border);
      const borderPolygon = polygon(border.geometry.coordinates);
      this.loggerSvc.info('Country border polygon', borderPolygon);
      return centerOfMass(borderPolygon).geometry.coordinates;
    }
    return undefined;
  });

  regionById(regionId: string) {
    const borderInfo = this.bordersSvc.borderInfo();
    if (borderInfo) {
      const result = borderInfo.features.find((f) => f.properties!['ID'] === regionId);
      if (result) {
        if (result.geometry.type === 'Polygon') {
          return result as Feature<Polygon, GeoJsonProperties>;
        } else if (result.geometry.type === 'MultiPolygon') {
          return result as Feature<MultiPolygon, GeoJsonProperties>;
        }
        return undefined;
      }
    }
    return undefined;
  }

  regionBBox(regionId: string) {
    const region = this.regionById(regionId);
    if (region) {
      const regionBBox = bbox(region);
      return regionBBox;
    }
    return undefined;
  }

  pointInRegion(regionId: string, pointCoords: [number, number]) {
    const borderInfo = this.bordersSvc.borderInfo();
    if (borderInfo) {
      const regionBorder = borderInfo.features.find((f) => f.properties!['ID'] === regionId);
      if (regionBorder && regionBorder.geometry.type === 'Polygon') {
        const regionPolygon = regionBorder as Feature<Polygon, GeoJsonProperties>;
        const pointTrf = point(pointCoords);
        return Boolean(booleanPointInPolygon(pointTrf, regionPolygon, { ignoreBoundary: false }));
      }
    }
    return false;
  }

  nearestPointInRegion(regionId: string, pointCoords: [number, number]) {
    const borderInfo = this.bordersSvc.borderInfo();
    if (this.pointInRegion(regionId, pointCoords)) {
      return pointCoords;
    }
    if (borderInfo) {
      const regionBorder = borderInfo.features.find((f) => f.properties!['ID'] === regionId);
      if (regionBorder && regionBorder.geometry.type === 'Polygon') {
        const regionPolygon = regionBorder as Feature<Polygon, GeoJsonProperties>;
        const regionLine = polygonToLine(regionPolygon);
        const points: Feature<Point>[] = [];
        if (regionLine.type === 'Feature') {
          const pointTrf = nearestPointOnLine(regionLine, point(pointCoords));
          points.push(pointTrf);
        } else {
          regionLine.features.forEach((f) => {
            const pointTrf = nearestPointOnLine(f, point(pointCoords));
            points.push(pointTrf);
          });
        }
        let minDistance = Infinity;
        let closestPoint = points[0].geometry.coordinates as [number, number];

        points.forEach((p) => {
          const dist = distance(pointCoords, p.geometry.coordinates as [number, number]);
          if (dist < minDistance) {
            minDistance = dist;
            closestPoint = p.geometry.coordinates as [number, number];
          }
        });
        return closestPoint;
      }
    }

    // We dont have border info yet, so, have the og coordinates
    return pointCoords;
  }
}
