import { HttpClient } from '@angular/common/http';
import { computed, effect, Injectable, signal, WritableSignal } from '@angular/core';
import { StyleSpecification } from 'maplibre-gl';
import { MapDisplaySettings } from '../models/map-display-settings';

@Injectable({
  providedIn: 'root'
})
export class MapDisplayService {

  private _currentSettings: WritableSignal<StyleSpecification | undefined> = signal(undefined)
  currentSettings = computed(() => this._currentSettings());

  constructor(private http: HttpClient) {
    this.http.get<StyleSpecification>('/assets/map-style.json').subscribe((style) => {
      this._currentSettings.set(style);
    });
    effect(() => {
      let cs = this._currentSettings();
      if (cs) {
        console.log('MapDisplayService: Map style updated');
      }
    });
  }

  updateSettings(style:MapDisplaySettings) {
    //find layer with osm id
    let current =this._currentSettings()

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
    this._currentSettings.set(current);
    console.log('MapDisplayService: updating map style');
  }
}
