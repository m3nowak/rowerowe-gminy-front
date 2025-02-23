import { Component, HostBinding, inject, input } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-strava-btn',
    imports: [],
    templateUrl: './strava-btn.component.html',
    providers: []
})
export class StravaBtnComponent {
  stravaAuthSvc = inject(AuthService);
  @HostBinding('class') class = 'flex h-12';
  grow = input(false);
  @HostBinding('class.grow') get growClass() {
    return this.grow;
  }
}
