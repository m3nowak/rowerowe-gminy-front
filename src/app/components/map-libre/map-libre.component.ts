import { Component, HostBinding, inject, OnDestroy, OnInit } from '@angular/core';
import { MapComponent as BaseMapComponent, EventData, GeoJSONSourceComponent, LayerComponent, PopupComponent } from '@maplibre/ngx-maplibre-gl';
import { Map as LibreMap, LngLat, MapGeoJSONFeature, MapMouseEvent } from 'maplibre-gl';
import { BordersService } from '../../services/borders.service';
import { BehaviorSubject, filter, Subscription, map, switchMap, tap } from 'rxjs';
import { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';
import { AsyncPipe, NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

interface FeatureClickData {
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
  imports: [BaseMapComponent, GeoJSONSourceComponent, LayerComponent, NgIf, AsyncPipe, PopupComponent],
  templateUrl: './map-libre.component.html',
  styleUrl: './map-libre.component.scss',
})
export class MapLibreComponent implements OnInit, OnDestroy {
  @HostBinding('class') class = 'h-flex-content h-flex-container';

  mapCp: LibreMap | undefined;

  activeRoute = inject(ActivatedRoute);
  bordersService = inject(BordersService);

  featureCollection$ = new BehaviorSubject<GeoJSONFeatureNamed | undefined>(undefined);
  selectedCoords$ = new BehaviorSubject<LngLat | undefined>(undefined);
  selectedFeature$ = new BehaviorSubject<FeatureClickData | undefined>(undefined);


  routeSub: Subscription | undefined;
  bordersServiceSub: Subscription | undefined;

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
    if (this.bordersServiceSub) {
      this.bordersServiceSub.unsubscribe();
    }
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
            default:
              return this.bordersService.countryBorders();
          }
        }),
        tap((fc) => {
          console.log('Feature collection loaded elements: ' + fc.features.features.length);
        }),
        map((fc) => ({
          name: `borders-${fc.name}`,
          data: fc.features,
        }))
      )
      .subscribe((fc) => {
        this.featureCollection$.next(fc);
        this.mapCp?.redraw();
      });
  }

  private extractTerytFromEvent(event: MapMouseEvent & { features?: MapGeoJSONFeature[] }): FeatureClickData | undefined {
    if (event.features && event.features.length > 0) {
      let feature = event.features[0];
      if (feature.properties && feature.properties['TERYT']) {
        let teryt = feature.properties['TERYT'];
        let name = feature.properties['name'];
        let lngLat = event.lngLat;
        return { teryt, name, lngLat };
      }
    }
    return undefined;
  }
  genRandomColor(): string {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  }
  onLayerClick(
    event: MapMouseEvent & {
      features?: MapGeoJSONFeature[];
    }
  ) {
    let teryt = this.extractTerytFromEvent(event);
    this.selectedFeature$.next(teryt);
    if (teryt) {
      console.log('Layer click TERYT:', teryt);
    } else {
      console.log('Layer click without TERYT');
    }
  }

  onMapLoad(mapP: LibreMap) {
    this.mapCp = mapP;
    this.setupRouteSub();
  }
}
