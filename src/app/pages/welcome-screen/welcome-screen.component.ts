import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CustomNGXLoggerService } from 'ngx-logger';
import { StravaBtnComponent } from '../../common-components/strava-btn/strava-btn.component';

import { FooterComponent } from '../../components/footer/footer.component';
import { UserConsentsService } from '../../services/user-consents.service';
import { CookiePopupComponent } from '../../components/cookie-popup/cookie-popup.component';

@Component({
  selector: 'app-welcome-screen',
  imports: [StravaBtnComponent, FooterComponent, CookiePopupComponent],
  templateUrl: './welcome-screen.component.html',
  styleUrls: ['./welcome-screen.component.css'],
})
export class WelcomeScreenComponent {
  logger = inject(CustomNGXLoggerService).getNewInstance({
    partialConfig: { context: 'WelcomeScreen' },
  });

  stravaAuthSvc = inject(AuthService);
  userConsentsSvc = inject(UserConsentsService);

  loginClick() {
    this.logger.info('Login clicked');
    this.stravaAuthSvc.logIn();
  }
}
