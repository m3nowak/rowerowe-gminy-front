import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FeatureCollection } from '../models/geo';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class BordersService {
  constructor(private http: HttpClient) { }

  countryBorders(): Observable<FeatureCollection> {
    return this.http.get<FeatureCollection>(environment.baseBorderUrl + 'country.json');
  }

  voivodeshipsBorders(): Observable<FeatureCollection> {
    return this.http.get<FeatureCollection>(environment.baseBorderUrl + 'voivodeships.json');
  }

  countiesBorders(): Observable<FeatureCollection> {
    return this.http.get<FeatureCollection>(environment.baseBorderUrl + 'counties.json');
  }

  communesBorders(): Observable<FeatureCollection> {
    return this.http.get<FeatureCollection>(environment.baseBorderUrl + 'communes.json');
  }
}
