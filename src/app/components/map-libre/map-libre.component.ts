import { Component, computed, effect, EventEmitter, HostBinding, inject, model, OnDestroy, OnInit, Output, signal, WritableSignal } from '@angular/core';
import { AttributionControlDirective, MapComponent as BaseMapComponent, ControlComponent, GeoJSONSourceComponent, LayerComponent } from '@maplibre/ngx-maplibre-gl';
import { Map as LibreMap, LngLat, MapGeoJSONFeature, MapMouseEvent } from 'maplibre-gl';
import { BordersService } from '../../services/borders.service';
import { BehaviorSubject, filter, Subscription, map, switchMap, tap } from 'rxjs';
import { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';
import { AsyncPipe, NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MapDisplayService } from '../../services/map-display.service';
import { GeoFeatureDataService } from '../../services/geo-feature-data.service';
import { MapPopupComponent } from '../map-popup/map-popup.component';
import { CustomNGXLoggerService } from 'ngx-logger';

interface FeatureClickData {
  id: string;
  teryt: string;
  name: string;
  lngLat: LngLat;
}

@Component({
  selector: 'app-map-libre',
  standalone: true,
  imports: [BaseMapComponent, GeoJSONSourceComponent, LayerComponent, NgIf, AsyncPipe, MapPopupComponent, ControlComponent, AttributionControlDirective],
  templateUrl: './map-libre.component.html',
  styleUrl: './map-libre.component.scss',
})
export class MapLibreComponent implements OnInit, OnDestroy {
  regionId = model<string | undefined>(undefined);

  mapCp: LibreMap | undefined;

  loggerSvc = inject(CustomNGXLoggerService).getNewInstance({
    partialConfig: { context: 'MapLibreComponent' },
  });
  activeRoute = inject(ActivatedRoute);
  bordersService = inject(BordersService);
  mapDisplaySvc = inject(MapDisplayService);
  geoFeatureDataSvc = inject(GeoFeatureDataService);

  mapDisplaySettings$ = this.mapDisplaySvc.currentSettings$.pipe(filter((s) => s !== undefined));

  bordersSelectedFilter = computed<any>(() => {
    let regionId = this.regionId();
    if (regionId) {
      let filter = [
        'let',
        'country',
        '0',
        ['any', ['==', ['get', 'TERYT'], regionId], ['==', ['get', 'COU_ID'], regionId], ['==', ['get', 'VOI_ID'], regionId], ['==', ['var', 'country'], regionId]],
        // somehow ['==', '0', regionId] does not work
      ];

      this.loggerSvc.info('Borders selected filter', filter);
      return filter;
    } else {
      return false;
    }
  });

  routeSub: Subscription | undefined;
  bordersServiceSub: Subscription | undefined;
  mapDisplaySvcSub: Subscription | undefined;

  constructor() {
    this.mapDisplaySvcSub = this.mapDisplaySvc.currentSettings$.subscribe((style) => {
      if (this.mapCp && style) {
        this.mapCp.setStyle(style);
      }
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
    if (this.bordersServiceSub) {
      this.bordersServiceSub.unsubscribe();
    }
    if (this.mapDisplaySvcSub) {
      this.mapDisplaySvcSub.unsubscribe();
    }
  }

  onLayerClick(
    event: MapMouseEvent & {
      features?: MapGeoJSONFeature[];
    },
  ) {
    let feature = event.features![0];
    console.log('Layer click feature id:', feature.id, feature);
    let teryt = feature.id as string;
    this.regionId.set(teryt);
  }

  onMapLoad(mapP: LibreMap) {
    this.mapCp = mapP;
  }
}
