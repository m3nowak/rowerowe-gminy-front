import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CustomNGXLoggerService } from 'ngx-logger';
import { StravaBtnComponent } from '../../common-components/strava-btn/strava-btn.component';
import { Router, RouterLink } from '@angular/router';
import { BtnDirective } from '../../common-components/btn.directive';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { tablerMap } from '@ng-icons/tabler-icons';

@Component({
    selector: 'app-welcome-screen',
    imports: [StravaBtnComponent, BtnDirective, RouterLink, NgIcon],
    providers: [provideIcons({ tablerMap })],
    templateUrl: './welcome-screen.component.html',
    styleUrl: './welcome-screen.component.scss'
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
