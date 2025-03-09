import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { CustomNGXLoggerService } from 'ngx-logger';
import posthog from 'posthog-js';

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

  consentLevelEffect = effect(() => {
    const concentLevel = this.consentLevel();
    switch (concentLevel) {
      case 'rejected':
        posthog.opt_out_capturing();
        this.cookieSvc.delete(CONSENT_KEY);
        this.userGaveAnswer.set(true);
        break;
      case 'required':
        posthog.opt_out_capturing();
        this.cookieSvc.set(CONSENT_KEY, concentLevel);
        this.userGaveAnswer.set(true);
        break;
      case 'tracking':
        posthog.opt_in_capturing();
        this.cookieSvc.set(CONSENT_KEY, concentLevel);
        this.userGaveAnswer.set(true);
        break;
      case 'unknown':
        posthog.opt_out_capturing();
        this.loggerSvc.warn('Unknown consent level');
        break;
    }
  });
}
