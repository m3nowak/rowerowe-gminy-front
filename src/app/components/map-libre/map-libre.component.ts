import { Component, computed, inject, model, OnDestroy, signal } from '@angular/core';
import {
  AttributionControlDirective,
  MapComponent as BaseMapComponent,
  ControlComponent,
  GeoJSONSourceComponent,
  LayerComponent,
} from '@maplibre/ngx-maplibre-gl';
import {
  Map as LibreMap,
  LngLatLike,
  MapGeoJSONFeature,
  MapLibreEvent,
  MapMouseEvent,
} from 'maplibre-gl';
import { BordersService } from '../../services/borders.service';
import { Subscription } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GeoFeatureDataService } from '../../services/geo-feature-data.service';
import { CustomNGXLoggerService } from 'ngx-logger';
import { pointToPointTransitionTarget } from '../../utils/geo';

@Component({
  selector: 'app-map-libre',
  imports: [
    BaseMapComponent,
    GeoJSONSourceComponent,
    LayerComponent,
    AsyncPipe,
    ControlComponent,
    AttributionControlDirective,
  ],
  templateUrl: './map-libre.component.html',
})
export class MapLibreComponent implements OnDestroy {
  regionId = model<string | undefined>(undefined);

  mapCp: LibreMap | undefined;

  center = signal<LngLatLike>([19.42366667, 52.11433333]);

  loggerSvc = inject(CustomNGXLoggerService).getNewInstance({
    partialConfig: { context: 'MapLibreComponent' },
  });
  activeRoute = inject(ActivatedRoute);
  bordersService = inject(BordersService);
  geoFeatureDataSvc = inject(GeoFeatureDataService);

  // Yeah, i give up on typing this, this expression is bugged
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bordersSelectedFilter = computed<any>(() => {
    const regionId = this.regionId();
    if (regionId === '') {
      return true;
    }
    if (regionId) {
      const filter2 = ['==', ['get', 'ID'], regionId];
      this.loggerSvc.info('Borders selected filter', filter2);
      return filter2;
    } else {
      return false;
    }
  });

  routeSub: Subscription | undefined;
  bordersServiceSub: Subscription | undefined;

  onMoveEnd(evt: MapLibreEvent): void {
    const center = evt.target.getCenter();
    const isOob = !this.geoFeatureDataSvc.pointInRegion('PL', [center.lng, center.lat]);
    this.loggerSvc.info('Center is outside PL:', isOob);
    if (isOob) {
      const closestPoint = this.geoFeatureDataSvc.nearestPointInRegion('PL', [
        center.lng,
        center.lat,
      ]);
      this.loggerSvc.info('Closest point in PL:', closestPoint);
      // We don't want to set the center on a boundary, because it can cause a loop, so we add a small offset
      this.center.set(pointToPointTransitionTarget([center.lng, center.lat], closestPoint));
    }
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
    if (this.bordersServiceSub) {
      this.bordersServiceSub.unsubscribe();
    }
  }

  onLayerClick(
    event: MapMouseEvent & {
      features?: MapGeoJSONFeature[];
    },
  ) {
    const feature = event.features![0];
    console.log('Layer click feature id:', feature.id, feature);
    const teryt = feature.id as string;
    this.regionId.set(teryt);
  }

  onMapLoad(mapP: LibreMap) {
    this.mapCp = mapP;
    // const bbox = this.geoFeatureDataSvc.regionBBox('PL')!;
    this.fitMapToRegion('PL');
  }

  fitMapToRegion(regionId: string) {
    const bbox = this.geoFeatureDataSvc.regionBBox(regionId);
    if (bbox) {
      this.mapCp!.fitBounds(
        [
          [bbox[0], bbox[1]],
          [bbox[2], bbox[3]],
        ],
        {
          padding: 20,
        },
      );
    }
  }
}
