import { Component, inject } from '@angular/core';
import {MatSliderModule} from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { MatLabel } from '@angular/material/form-field';
import { MapDisplaySettings } from '../../models/map-display-settings';
import { MapDisplayService } from '../../services/map-display.service';

@Component({
  selector: 'app-map-display-control',
  standalone: true,
  imports: [MatSliderModule, FormsModule, MatLabel],
  templateUrl: './map-display-control.component.html',
  styleUrl: './map-display-control.component.scss'
})
export class MapDisplayControlComponent {
  hueRotation: number = 0;
  opacity: number = 100;
  brightnessMin: number = 0;
  brightnessMax: number = 100;
  saturation: number = -100;
  contrast: number = 0;

  mapDisplaySvc = inject(MapDisplayService);

  onValueChange() {
    let settings: MapDisplaySettings = {
      hueRotation: this.hueRotation,
      opacity: this.opacity,
      brightnessMin: this.brightnessMin,
      brightnessMax: this.brightnessMax,
      saturation: this.saturation,
      contrast: this.contrast
    };
    this.mapDisplaySvc.updateSettings(settings);
  }

}
