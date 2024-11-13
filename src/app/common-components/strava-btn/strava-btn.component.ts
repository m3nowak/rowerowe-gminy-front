import { Component, HostBinding, input } from '@angular/core';

@Component({
  selector: 'app-strava-btn',
  standalone: true,
  imports: [],
  templateUrl: './strava-btn.component.html',
  providers: [],
})
export class StravaBtnComponent {
  @HostBinding('class') class = 'flex h-12';
  grow = input(false);
  @HostBinding('class.grow') get growClass() {
    return this.grow;
  }
}
