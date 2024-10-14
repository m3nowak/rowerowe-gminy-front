import { Component, inject } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { MatLabel } from '@angular/material/form-field';
import { MapDisplaySettings } from '../../models/map-display-settings';
import { MatExpansionModule } from '@angular/material/expansion';
import { MapDisplayService } from '../../services/map-display.service';

@Component({
  selector: 'app-map-display-control',
  standalone: true,
  imports: [MatSliderModule, FormsModule, MatLabel, MatExpansionModule],
  templateUrl: './map-display-control.component.html',
  styleUrl: './map-display-control.component.scss',
})
export class MapDisplayControlComponent {
  hueRotation = 0;
  opacity = 100;
  brightnessMin = 0;
  brightnessMax = 100;
  saturation = -100;
  contrast = 0;

  mapDisplaySvc = inject(MapDisplayService);

  onValueChange() {
    const settings: MapDisplaySettings = {
      hueRotation: this.hueRotation,
      opacity: this.opacity,
      brightnessMin: this.brightnessMin,
      brightnessMax: this.brightnessMax,
      saturation: this.saturation,
      contrast: this.contrast,
    };
    this.mapDisplaySvc.updateSettings(settings);
  }
}
