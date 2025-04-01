import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CustomNGXLoggerService } from 'ngx-logger';
import { StravaBtnComponent } from '../../common-components/strava-btn/strava-btn.component';

import { FooterComponent } from '../../components/footer/footer.component';
import { UserConsentsService } from '../../services/user-consents.service';
import { CookiePopupComponent } from '../../components/cookie-popup/cookie-popup.component';
import { Title, Meta } from '@angular/platform-browser';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { tablerMap } from '@ng-icons/tabler-icons';
import { BtnDirective } from '../../common-components/btn.directive';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-welcome-screen',
  imports: [
    StravaBtnComponent,
    FooterComponent,
    CookiePopupComponent,
    NgIcon,
    BtnDirective,
    RouterLink,
  ],
  templateUrl: './welcome-screen.component.html',
  styleUrls: ['./welcome-screen.component.css'],
  providers: [provideIcons({ tablerMap })],
})
export class WelcomeScreenComponent {
  logger = inject(CustomNGXLoggerService).getNewInstance({
    partialConfig: { context: 'WelcomeScreen' },
  });

  authSvc = inject(AuthService);
  userConsentsSvc = inject(UserConsentsService);
  title = inject(Title);
  meta = inject(Meta);

  constructor() {
    this.title.setTitle('Rowerowe Gminy');
    this.meta.updateTag({
      name: 'description',
      content: 'Rowerowe Gminy - Śledź przejechane gminy na rowerze!',
    });
    this.meta.updateTag({
      name: 'keywords',
      content: 'rowerowe, gminy, rower, strava, turystyka, polska, powiaty, województwa',
    });
  }

  loginClick() {
    this.logger.info('Login clicked');
    this.authSvc.logIn();
  }
}
