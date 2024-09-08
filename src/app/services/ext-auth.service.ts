import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { Params } from '@angular/router';
import { CustomNGXLoggerService } from 'ngx-logger';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ExtAuthService {
  private loggerSvc = inject(CustomNGXLoggerService).getNewInstance({
    partialConfig: { context: 'ExtAuth' },
  });

  currentToken = signal<string | undefined>(localStorage.getItem('stravaToken') ?? undefined);

  localStorageEffect = effect(() => {
    let token = this.currentToken();
    if (token) {
      localStorage.setItem('stravaToken', token);
    }
  });

  isLoggedIn = computed(() => this.currentToken() !== undefined);

  logIn() {
    let stravaUrl = new URL('http://www.strava.com/oauth/authorize');
    stravaUrl.searchParams.set('client_id', environment.clientId);
    stravaUrl.searchParams.set('response_type', 'code');
    stravaUrl.searchParams.set('redirect_uri', environment.localBaseUrl + 'authorized');
    stravaUrl.searchParams.set('approval_prompt', 'force');
    stravaUrl.searchParams.set('scope', 'read,activity:read');
    window.location.href = stravaUrl.href;
  }

  feedToken(params: Params) {
    //example response:
    //http://localhost:4200/exchange_token?state=&code=<TOKEN>&scope=read
    this.loggerSvc.info('Token received:', params);
    this.currentToken.set(params['code']);
  }
}
