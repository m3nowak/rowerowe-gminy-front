import { Component, HostBinding, inject } from '@angular/core';
import { StravaAuthService } from '../../services/strava-auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login-purgatory',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  templateUrl: './login-purgatory.component.html',
  styleUrl: './login-purgatory.component.scss',
})
export class LoginPurgatoryComponent {
  // @HostBinding('class') class = 'h-flex-content h-flex-container';
  extAuthSvc = inject(StravaAuthService);
}
