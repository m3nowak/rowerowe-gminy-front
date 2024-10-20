import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { Params, Router } from '@angular/router';
import { CustomNGXLoggerService } from 'ngx-logger';
import { environment } from '../../environments/environment';
import { AuthService as ApiAuthService } from '../api/services';
import * as jose from 'jose';
import { DateTime } from 'luxon';

const TOKEN_KEY = 'authToken';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggerSvc = inject(CustomNGXLoggerService).getNewInstance({
    partialConfig: { context: 'ExtAuth' },
  });
  authSvc = inject(ApiAuthService);
  router = inject(Router);

  currentToken = signal<string | undefined>(localStorage.getItem(TOKEN_KEY) ?? undefined);

  localStorageEffect = effect(() => {
    const token = this.currentToken();
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  });

  loginExpiresAt = computed(() => {
    const token = this.currentToken();
    if (!token) return undefined;
    const decoded = jose.decodeJwt(token);
    if (decoded && decoded.exp) {
      const expiration = DateTime.fromSeconds(decoded.exp);
      return expiration;
    }
    return undefined;
  });

  isLoggedIn = computed(() => this.currentToken() !== undefined);

  scopes = computed<string[]>(() => {
    const token = this.currentToken();
    if (!token) return [];
    const decoded = jose.decodeJwt(token) as { extras?: { scopes?: string[] } };
    if (decoded && decoded.extras && decoded.extras.scopes) {
      return decoded.extras.scopes;
    }
    return [];
  });

  isExpired() {
    const expiration = this.loginExpiresAt();
    if (!expiration) return true;
    const now = DateTime.utc();
    return expiration < now;
  }

  logIn() {
    const stravaUrl = new URL('http://www.strava.com/oauth/authorize');
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

  dumpTokenInfo() {
    const token = this.currentToken();
    if (!token) {
      this.loggerSvc.info('No token found');
      return;
    }
    const decoded = jose.decodeJwt(token);
    this.loggerSvc.info('Token decoded:', decoded);
    this.loggerSvc.info('Token expires at:', this.loginExpiresAt());
    this.loggerSvc.info('Token expired:', this.isExpired());
    this.loggerSvc.info('Token scopes:', this.scopes());
    this.loggerSvc.info('UTC now:', DateTime.utc());
  }

  feedToken(params: Params) {
    //example response:
    //http://localhost:4200/exchange_token?state=&code=<TOKEN>&scope=read
    this.loggerSvc.info('Token received:', params);
    const code = params['code'];
    const scopes = params['scope'].split(',');
    if (code) {
      this.authSvc.authenticateLoginAuthenticateHandler({ body: { code, scopes } }).subscribe((res) => {
        this.loggerSvc.info('Token exchanged:', res);
        this.currentToken.set(res.access_token);
      });
    }
  }
}
