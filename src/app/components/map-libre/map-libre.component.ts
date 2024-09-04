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

interface FeatureClickData {
  id: string;
  teryt: string;
  name: string;
  lngLat: LngLat;
}

interface GeoJSONFeatureNamed {
  name: string;
  data: FeatureCollection<Geometry, GeoJsonProperties>;
}

@Component({
  selector: 'app-map-libre',
  standalone: true,
  imports: [BaseMapComponent, GeoJSONSourceComponent, LayerComponent, NgIf, AsyncPipe, MapPopupComponent, ControlComponent, AttributionControlDirective],
  templateUrl: './map-libre.component.html',
  styleUrl: './map-libre.component.scss',
})
export class MapLibreComponent implements OnInit, OnDestroy {
  @HostBinding('class') class = 'h-flex-content h-flex-container';

  regionId = model<string | undefined>(undefined);

  mapCp: LibreMap | undefined;

  activeRoute = inject(ActivatedRoute);
  bordersService = inject(BordersService);
  geoFeatureDataService = inject(GeoFeatureDataService);
  mapDisplaySvc = inject(MapDisplayService);

  showPopup = true;

  featureCollection$ = new BehaviorSubject<GeoJSONFeatureNamed | undefined>(undefined);
  selectedCoords$ = new BehaviorSubject<LngLat | undefined>(undefined);
  selectedFeature$ = new BehaviorSubject<FeatureClickData | undefined>(undefined);
  mapDisplaySettings$ = this.mapDisplaySvc.currentSettings$.pipe(filter((s) => s !== undefined));

  bordersSelectedFilter = computed<any>(() => {
    let teryt = this.regionId();
    if (teryt) {
      return ['==', ['get', 'TERYT'], teryt];
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
  private featureCollectionAssignMetadata(fc: FeatureCollection<Geometry, GeoJsonProperties>): FeatureCollection<Geometry, GeoJsonProperties> {
    let features = fc.features.map((feature, index) => {
      let properties = feature?.properties ?? {};
      if (!properties.hasOwnProperty('isUnlocked')) {
        properties['isUnlocked'] = true;
      }
      return { ...feature, properties };
    });
    return { ...fc, features };
  }

  setupRouteSub() {
    this.routeSub = this.activeRoute.queryParams
      .pipe(
        map((params) => params['detail'] ?? 0),
        tap((detail) => {
          console.log('Detail level: ', detail);
        }),
        switchMap((detail) => {
          switch (detail) {
            case '1':
              return this.bordersService.voivodeshipsBorders();
            case '2':
              return this.bordersService.countiesBorders();
            case '3':
              return this.bordersService.communesBorders();
            case '4':
              return this.geoFeatureDataService.featureCollection$;
            default:
              return this.bordersService.countryBorders();
          }
        }),
        tap((fc) => {
          console.log('Feature collection loaded elements: ' + fc.features.features.length);
        }),
        map((fc) => ({
          name: `borders-${fc.name}`,
          data: this.featureCollectionAssignMetadata(fc.features),
        }))
      )
      .subscribe((fc) => {
        this.featureCollection$.next(fc);
      });
  }

  onLayerClick(
    event: MapMouseEvent & {
      features?: MapGeoJSONFeature[];
    }
  ) {
    let feature = event.features![0];
    console.log('Layer click feature id:', feature.id);
    let teryt = feature.id as string;
    this.regionId.set(teryt);
  }

  onMapLoad(mapP: LibreMap) {
    this.mapCp = mapP;
    this.setupRouteSub();
  }
}
