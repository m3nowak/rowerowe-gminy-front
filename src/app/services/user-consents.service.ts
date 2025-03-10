import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { CustomNGXLoggerService } from 'ngx-logger';
import posthog from 'posthog-js';
import { environment } from '../../environments/environment';

const CONSENT_KEY = 'rg-consent';

type ConsentLevel = 'unknown' | 'rejected' | 'required' | 'tracking';

@Injectable({
  providedIn: 'root',
})
export class UserConsentsService {
  private cookieSvc = inject(CookieService);
  private loggerSvc = inject(CustomNGXLoggerService).getNewInstance({
    partialConfig: { context: 'UserConsentsService' },
  });

  consentLevel = signal<ConsentLevel>('unknown');
  userGaveAnswer = signal(false);

  constructor() {
    if (this.cookieSvc.check(CONSENT_KEY)) {
      this.consentLevel.set(this.cookieSvc.get(CONSENT_KEY) as ConsentLevel);
      this.userGaveAnswer.set(true);
    } else {
      this.consentLevel.set('unknown');
      this.userGaveAnswer.set(false);
    }
  }

  userCanLogIn = computed(() => {
    const consentLevel = this.consentLevel();
    return consentLevel === 'required' || consentLevel === 'tracking';
  });

  private posthogAllow(allow: boolean) {
    posthog.set_config({
      persistence: allow ? 'localStorage+cookie' : 'memory',
    });
    if (allow) {
      posthog.opt_in_capturing();
      posthog.persistence?.save();
    } else {
      posthog.opt_out_capturing();
      posthog.persistence?.clear();
    }
  }

  consentLevelEffect = effect(() => {
    const concentLevel = this.consentLevel();
    this.loggerSvc.info('Consent level changed', concentLevel);
    switch (concentLevel) {
      case 'rejected':
        posthog.opt_out_capturing();
        this.cookieSvc.delete(CONSENT_KEY);
        this.userGaveAnswer.set(true);
        this.posthogAllow(false);
        break;
      case 'required':
        posthog.opt_out_capturing();
        this.cookieSvc.set(
          CONSENT_KEY,
          concentLevel,
          undefined,
          '/',
          undefined,
          environment.production,
          'Strict',
        );
        this.userGaveAnswer.set(true);
        this.posthogAllow(false);
        break;
      case 'tracking':
        posthog.opt_in_capturing();
        this.cookieSvc.set(
          CONSENT_KEY,
          concentLevel,
          undefined,
          '/',
          undefined,
          environment.production,
          'Strict',
        );
        this.userGaveAnswer.set(true);
        this.posthogAllow(true);
        break;
      case 'unknown':
        posthog.opt_out_capturing();
        this.posthogAllow(false);
        break;
    }
  });
}
