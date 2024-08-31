import {
  Component,
  HostBinding,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  MapComponent as BaseMapComponent,
  GeoJSONSourceComponent,
  LayerComponent,
} from '@maplibre/ngx-maplibre-gl';
import { Map as LibreMap } from 'maplibre-gl';
import { BordersService } from '../../services/borders.service';
import {
  BehaviorSubject,
  filter,
  Subscription,
  map,
  switchMap,
  tap,
} from 'rxjs';
import { FeatureCollection } from 'geojson';
import { AsyncPipe, NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-map-libre',
  standalone: true,
  imports: [
    BaseMapComponent,
    GeoJSONSourceComponent,
    LayerComponent,
    NgIf,
    AsyncPipe,
  ],
  templateUrl: './map-libre.component.html',
  styleUrl: './map-libre.component.scss',
})
export class MapLibreComponent implements OnInit, OnDestroy {
  @HostBinding('class') class = 'h-flex-content h-flex-container';

  map_cp: LibreMap | undefined;

  activeRoute = inject(ActivatedRoute);
  bordersService = inject(BordersService);

  featureCollection$: BehaviorSubject<any | undefined> = new BehaviorSubject<
    any | undefined
  >(undefined);
  fcStatic: any | undefined;

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
          console.log(
            'Feature collection loaded elements: ' + fc.features.features.length
          );
        }),
        map((fc) => ({
          name: `borders-${fc.name}`,
          data: fc.features,
        }))
      )
      .subscribe((fc) => {
        // this.fcStatic = fc;
        this.featureCollection$.next(fc);
        this.map_cp?.redraw();
      });
  }
  fill: any;

  onMapLoad(map_p: LibreMap) {
    this.map_cp = map_p;
    this.setupRouteSub();
  }
}
