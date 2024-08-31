import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
// import { FeatureCollection } from '../models/geo';
import { environment } from '../../environments/environment';


import { GeoJsonTypes, FeatureCollection } from 'geojson';
import { NamedFeatureCollection } from '../models/geo-ext';


@Injectable({
  providedIn: 'root'
})
export class BordersService {
  constructor(private http: HttpClient) { }

  countryBorders(): Observable<NamedFeatureCollection> {
    return this.http.get<FeatureCollection>(environment.baseBorderUrl + 'country.json').pipe(
      map((fc) => {
        return {
          name: 'country',
          features: fc
        };
      })
    );
  }

  voivodeshipsBorders(): Observable<NamedFeatureCollection> {
    return this.http.get<FeatureCollection>(environment.baseBorderUrl + 'voivodeships.json').pipe(
      map((fc) => {
        return {
          name: 'counties',
          features: fc
        };
      })
    );
  }

  countiesBorders(): Observable<NamedFeatureCollection> {
    return this.http.get<FeatureCollection>(environment.baseBorderUrl + 'counties.json').pipe(
      map((fc) => {
        return {
          name: 'counties',
          features: fc
        };
      })
    );
  }

  communesBorders(): Observable<NamedFeatureCollection> {
    return this.http.get<FeatureCollection>(environment.baseBorderUrl + 'communes.json').pipe(
      map((fc) => {
        return {
          name: 'communes',
          features: fc
        };
      })
    );
  }
}
