import { Component, effect, HostBinding, inject, OnDestroy, OnInit } from '@angular/core';
import { MapComponent as BaseMapComponent, EventData, GeoJSONSourceComponent, LayerComponent, PopupComponent } from '@maplibre/ngx-maplibre-gl';
import { Map as LibreMap, LngLat, MapGeoJSONFeature, MapMouseEvent } from 'maplibre-gl';
import { BordersService } from '../../services/borders.service';
import { BehaviorSubject, filter, Subscription, map, switchMap, tap } from 'rxjs';
import { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';
import { AsyncPipe, NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MapDisplayService } from '../../services/map-display.service';

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
  imports: [BaseMapComponent, GeoJSONSourceComponent, LayerComponent, NgIf, AsyncPipe, PopupComponent],
  templateUrl: './map-libre.component.html',
  styleUrl: './map-libre.component.scss',
})
export class MapLibreComponent implements OnInit, OnDestroy {
  @HostBinding('class') class = 'h-flex-content h-flex-container';

  mapCp: LibreMap | undefined;

  activeRoute = inject(ActivatedRoute);
  bordersService = inject(BordersService);
  mapDisplaySvc = inject(MapDisplayService);

  

  featureCollection$ = new BehaviorSubject<GeoJSONFeatureNamed | undefined>(undefined);
  selectedCoords$ = new BehaviorSubject<LngLat | undefined>(undefined);
  selectedFeature$ = new BehaviorSubject<FeatureClickData | undefined>(undefined);
  mapDisplaySettings$ = this.mapDisplaySvc.currentSettings$.pipe(
    filter((s) => s !== undefined),
    tap((s) => {
      console.log('MapLibreComponent: Map style updated', s);
    }),
  );


  routeSub: Subscription | undefined;
  bordersServiceSub: Subscription | undefined;
  mapDisplaySvcSub: Subscription | undefined;


  constructor() {
    this.mapDisplaySvcSub = this.mapDisplaySvc.currentSettings$.subscribe((style) => {
      if (this.mapCp && style) {
        this.mapCp.setStyle(style);
        //this.mapCp.getLayer('osm')!
        //this.mapCp.redraw();
      }
      console.log('MapLibreComponent: Map style updated');
    });
    // effect(() => {
    //   let cs = this.mapDisplaySvc.currentSettings();
    //   if (this.mapCp && cs) {
    //     this.mapCp.setStyle(cs);
    //     this.mapCp.redraw();
    //   }
    //   console.log('MapLibreComponent: Map style updated');
    // });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
    if (this.bordersServiceSub) {
      this.bordersServiceSub.unsubscribe();
    }
  }

  private terytToFeatureId(teryt: string): string {
    return `PL${teryt}`;
  }

  private featureCollectionAssignMetadata(fc: FeatureCollection<Geometry, GeoJsonProperties>): FeatureCollection<Geometry, GeoJsonProperties> {
    let features = fc.features.map((feature, index) => {
      let teryt = feature.properties?.['TERYT'];
      // if (teryt) {
      //   let id = this.terytToFeatureId(teryt);
      //   return { ...feature, id };
      // }
      // else {
      //   let id = `fallback-${index}`;
      //   return { ...feature, id };
      // }
      let id = feature.properties?.['TERYT'];
      let state = {'hover': false};


      return { ...feature, id, state };
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
        //this.mapCp?.redraw();
      });
  }

  private extractTerytFromEvent(event: MapMouseEvent & { features?: MapGeoJSONFeature[] }): FeatureClickData | undefined {
    if (event.features && event.features.length > 0) {
      let feature = event.features[0];
      if (feature.properties && feature.properties['TERYT']) {
        let id = feature.id as string;
        let teryt = feature.properties['TERYT'];
        let name = feature.properties['name'];
        let lngLat = event.lngLat;
        return { id, teryt, name, lngLat };
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
    let feature = event.features![0];
    console.log('Layer click feature id:', feature.id);
    let teryt = this.extractTerytFromEvent(event);
    this.selectedFeature$.next(teryt);
    //TODO: ogarnąć kolorki za pomocą https://docs.mapbox.com/mapbox-gl-js/example/hover-styles/
    let state = this.mapCp!.getFeatureState({ source: 'borders', id: event.features![0].id! });
    console.log('Layer click feature:', feature);
    console.log('Layer click state:', state);
    let isSelected = state.selected || false;
    this.mapCp!.setFeatureState({ source: 'borders', id: event.features![0].id! }, { selected: !isSelected });
    // this.mapCp!.getLayer('borders')?.setPaintProperty('fill-color', this.genRandomColor());
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
