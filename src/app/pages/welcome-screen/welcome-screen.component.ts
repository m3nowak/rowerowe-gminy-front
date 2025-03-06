import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CustomNGXLoggerService } from 'ngx-logger';
import { StravaBtnComponent } from '../../common-components/strava-btn/strava-btn.component';
import { Router } from '@angular/router';

import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-welcome-screen',
  imports: [StravaBtnComponent, FooterComponent],
  templateUrl: './welcome-screen.component.html',
  styleUrls: ['./welcome-screen.component.css'],
})
export class WelcomeScreenComponent {
  logger = inject(CustomNGXLoggerService).getNewInstance({
    partialConfig: { context: 'WelcomeScreen' },
  });

  routerSvc = inject(Router);

  stravaAuthSvc = inject(AuthService);

  loginClick() {
    this.logger.info('Login clicked');
    this.stravaAuthSvc.logIn();
  }
}
