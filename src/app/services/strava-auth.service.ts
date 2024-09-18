import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { Params, Router } from '@angular/router';
import { CustomNGXLoggerService } from 'ngx-logger';
import { environment } from '../../environments/environment';
import { AuthService } from '../api/services';

@Injectable({
  providedIn: 'root',
})
export class StravaAuthService {
  private loggerSvc = inject(CustomNGXLoggerService).getNewInstance({
    partialConfig: { context: 'ExtAuth' },
  });
  authSvc = inject(AuthService);
  router = inject(Router);

  currentToken = signal<string | undefined>(localStorage.getItem('stravaToken') ?? undefined);

  localStorageEffect = effect(() => {
    let token = this.currentToken();
    if (token) {
      localStorage.setItem('stravaToken', token);
    } else {
      localStorage.removeItem('stravaToken');
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

  logOut() {
    this.currentToken.set(undefined);
    this.router.navigate(['']);
  }

  feedToken(params: Params) {
    //example response:
    //http://localhost:4200/exchange_token?state=&code=<TOKEN>&scope=read
    this.loggerSvc.info('Token received:', params);
    let code = params['code'];
    let scopes = params['scope'].split(',');
    if (code) {
      this.authSvc.authenticateAuthenticateHandler({ body: { code, scopes } }).subscribe((res) => {
        this.loggerSvc.info('Token exchanged:', res);
        this.currentToken.set(res.token);
      });
    }

    //this.currentToken.set(params['code']);
  }
}
