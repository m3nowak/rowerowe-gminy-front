import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CustomNGXLoggerService } from 'ngx-logger';
import { StravaBtnComponent } from '../../common-components/strava-btn/strava-btn.component';
import { BtnComponent } from '../../common-components/btn/btn.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome-screen',
  standalone: true,
  imports: [StravaBtnComponent, BtnComponent],
  templateUrl: './welcome-screen.component.html',
  styleUrl: './welcome-screen.component.scss',
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

  demoClick() {
    this.routerSvc.navigate(['home']);
  }
}
