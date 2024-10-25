import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CustomNGXLoggerService } from 'ngx-logger';
import { StravaBtnComponent } from '../../common-components/strava-btn/strava-btn.component';

@Component({
  selector: 'app-welcome-screen',
  standalone: true,
  imports: [StravaBtnComponent],
  templateUrl: './welcome-screen.component.html',
  styleUrl: './welcome-screen.component.scss',
})
export class WelcomeScreenComponent {
  logger = inject(CustomNGXLoggerService).getNewInstance({
    partialConfig: { context: 'WelcomeScreen' },
  });

  stravaAuthSvc = inject(AuthService);

  loginClick() {
    this.logger.info('Login clicked');
    this.stravaAuthSvc.logIn();
  }
}
