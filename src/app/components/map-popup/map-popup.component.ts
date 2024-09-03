import { Component, EventEmitter, Output } from '@angular/core';
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
  longText = `Info o wrocławiu`;

  closeBtnPressed() {
    this.close.emit();
  }
}
