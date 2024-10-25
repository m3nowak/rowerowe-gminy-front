import { Component } from '@angular/core';
import { EventEmitter, Output } from '@angular/core';
import { provideIcons, NgIconComponent } from '@ng-icons/core';
import { tablerLogin, tablerLogout } from '@ng-icons/tabler-icons';

@Component({
  selector: 'app-strava-btn',
  standalone: true,
  imports: [NgIconComponent],
  templateUrl: './strava-btn.component.html',
  providers: [provideIcons({ tablerLogout, tablerLogin })],
})
export class StravaBtnComponent {
  @Output() clicked = new EventEmitter<void>();

  onButtonClick() {
    this.clicked.emit();
  }
}
