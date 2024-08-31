import {
  Component,
  AfterViewInit,
  HostBinding,
  inject,
  OnInit,
} from '@angular/core';
import * as L from 'leaflet';
import { BordersService } from '../../services/borders.service';
import { BehaviorSubject, filter, Observable, of } from 'rxjs';
import { FeatureCollection } from '../../models/geo';

//https://www.digitalocean.com/community/tutorials/angular-angular-and-leaflet

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent implements AfterViewInit, OnInit {
  @HostBinding('class') class = 'h-flex-content h-flex-container';

  private map!: L.Map;

  bordersService = inject(BordersService);

  featureCollection$: BehaviorSubject<FeatureCollection | undefined> = new BehaviorSubject<FeatureCollection | undefined>(undefined);

  mapFeaturesSub = this.featureCollection$
    .pipe(filter((featureCollection) => featureCollection !== undefined))
    .subscribe((featureCollection) => {
      let features = featureCollection.features;
      for (let i = 0; i < features.length; i++) {
        let feature = features[i];
        let style = {
          color: '#ff7800',
          weight: 5,
          opacity: 0.35,
        };
        L.geoJSON(feature as any, { style: style }).addTo(this.map);
      }
    });

  private initMap(): void {
    this.map = L.map('map', {
      center: [52.11433333, 19.42366667],
      zoom: 7,
    });

    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        minZoom: 3,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );

    tiles.addTo(this.map);

    // //get json file
    // fetch(
    //   'https://eu2.contabostorage.com/9556be5764414357ae3184b95da10055:rowerowegminy.pl/counties.json'
    // ).then((response) =>
    //   response.json().then((data) => {
    //     let features = data.features;
    //     for (let i = 0; i < features.length; i++) {
    //       let feature = features[i];
    //       let style = {
    //         color: '#ff7800',
    //         weight: 5,
    //         opacity: 0.35,
    //       };
    //       L.geoJSON(feature, { style: style }).addTo(this.map);
    //     }
    //   })
    // );
  }

  ngAfterViewInit(): void {
    this.initMap();
  }
  ngOnInit(): void {
    this.bordersService.communesBorders().subscribe((featureCollection) => {
      this.featureCollection$.next(featureCollection);
    });
  }
}
