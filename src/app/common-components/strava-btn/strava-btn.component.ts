import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-strava-btn',
  standalone: true,
  imports: [],
  templateUrl: './strava-btn.component.html',
  providers: [],
})
export class StravaBtnComponent {
  @HostBinding('class') class = 'h-12';
}
