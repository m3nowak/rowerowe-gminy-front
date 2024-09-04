import { Component, EventEmitter, input, model, Output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-map-popup',
  standalone: true,
  imports: [MatCardModule, MatButton],
  templateUrl: './map-popup.component.html',
  styleUrl: './map-popup.component.scss'
})
export class MapPopupComponent {
  @Output() close = new EventEmitter();

  regionId = model<string | undefined>(undefined);

  closeBtnPressed() {
    this.close.emit();
  }

  switchToParent() {
    let regionId = this.regionId();
    if (regionId) {
      let length = regionId.length;
      switch (length) {
        case 2:
          this.regionId.set('0');
          break;
        case 4:
          this.regionId.set(regionId.substring(0, 2));
          break;
        case 7:
          this.regionId.set(regionId.substring(0, 4));
          break;
        default:
          break;
      }
    }
  }

}
