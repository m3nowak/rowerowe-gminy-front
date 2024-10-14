import { HttpClient } from '@angular/common/http';
import { computed, effect, Injectable, signal, WritableSignal } from '@angular/core';
import { StyleSpecification } from 'maplibre-gl';
import { MapDisplaySettings } from '../models/map-display-settings';
import { toObservable } from '@angular/core/rxjs-interop';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MapDisplayService {
  private _currentSettings: BehaviorSubject<StyleSpecification | undefined> = new BehaviorSubject<StyleSpecification | undefined>(undefined);
  // private _currentSettings: WritableSignal<StyleSpecification | undefined> = signal(undefined)
  currentSettings$: Observable<StyleSpecification | undefined> = this._currentSettings.asObservable();

  constructor(private http: HttpClient) {
    this.http.get<StyleSpecification>('/assets/map-style.json').subscribe((style) => {
      this._currentSettings.next(style);
    });
    this.currentSettings$.subscribe((style) => {
      console.log('MapDisplayService: current settings updated (info from observable)');
    });
  }

  updateSettings(style: MapDisplaySettings) {
    //find layer with osm id
    let current = this._currentSettings.value;

    if (!current) {
      return;
    }
    let osmLayerIndex = 0;
    let paint = {
      'raster-hue-rotate': style.hueRotation,
      'raster-opacity': style.opacity / 100,
      'raster-brightness-min': style.brightnessMin / 100,
      'raster-brightness-max': style.brightnessMax / 100,
      'raster-saturation': style.saturation / 100,
      'raster-contrast': style.contrast / 100,
    };
    current.layers[osmLayerIndex].paint = paint;
    this._currentSettings.next(current);
    console.log('MapDisplayService: updating map style');
  }
}
