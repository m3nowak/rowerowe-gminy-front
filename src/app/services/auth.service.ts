import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { Params, Router } from '@angular/router';
import { CustomNGXLoggerService } from 'ngx-logger';
import { environment } from '../../environments/environment';
import { AuthService as ApiAuthService } from '../api/services';
import * as jose from 'jose';
import { DateTime } from 'luxon';
import { LoginResponseError, StravaScopes } from '../api/models';
import { catchError, map, Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import posthog from 'posthog-js';
import { CookieService } from 'ngx-cookie-service';

const TOKEN_KEY = 'authToken';

// export interface AuthRespose {
//   success: boolean;
//   isFirstLogin?: boolean;
//   errorCode?: string;
// }

export interface AuthResposeOK {
  success: true;
  isFirstLogin: boolean;
}

export interface AuthResposeErr {
  success: false;
  errorCode: string;
}

interface AuthInfo {
  stravaId: number;
  stravaUsername: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggerSvc = inject(CustomNGXLoggerService).getNewInstance({
    partialConfig: { context: 'ExtAuth' },
  });
  authSvc = inject(ApiAuthService);
  router = inject(Router);
  cookieSvc = inject(CookieService);

  currentToken = signal<string | undefined>(this.cookieSvc.get(TOKEN_KEY) ?? undefined);

  curentAuthInfo = computed<AuthInfo | undefined>(() => {
    const token = this.currentToken();
    if (!token) return undefined;
    const decoded = jose.decodeJwt(token) as { sub: string; preferred_username: string };
    if (decoded) {
      return {
        stravaId: parseInt(decoded.sub),
        stravaUsername: decoded.preferred_username,
      };
    }
    return undefined;
  });

  posthogAuthEffect = effect(() => {
    const authInfo = this.curentAuthInfo();
    if (authInfo) {
      posthog.identify(authInfo.stravaId.toString(), {
        username: authInfo.stravaUsername,
      });
    } else {
      posthog.reset();
    }
  });

  localStorageEffect = effect(() => {
    const token = this.currentToken();
    const expiration = this.loginExpiresAt();
    if (token) {
      this.cookieSvc.set(
        TOKEN_KEY,
        token,
        expiration!.toJSDate(),
        '/',
        undefined,
        environment.production,
        'Strict',
      );
      // localStorage.setItem(TOKEN_KEY, token);
    } else {
      this.cookieSvc.delete(TOKEN_KEY);
      // localStorage.removeItem(TOKEN_KEY);
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

  isLoggedIn = computed(() => this.currentToken() !== undefined && !this.isExpired());

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

  feedTokenResposive(code: string, scope: string): Observable<AuthResposeOK | AuthResposeErr> {
    const stravaScopes = scope.split(',').map((scope) => scope as StravaScopes);

    return this.authSvc.loginLoginPost({ body: { code, scopes: stravaScopes } }).pipe(
      map((res) => {
        this.loggerSvc.info('Token exchanged:', res);
        this.currentToken.set(res.access_token);
        return {
          success: true as const,
          isFirstLogin: res.isFirstLogin,
        };
      }),
      catchError((err: HttpErrorResponse) => {
        if (err.status !== 400) {
          console.error('Error exchanging token:', err);
          throw err;
        }
        const errInfo = err.error as LoginResponseError;
        console.error('Error exchanging token:', err);
        return [{ success: false as const, errorCode: errInfo.cause }];
      }),
    );
  }

  feedToken(params: Params) {
    //example response:
    //http://localhost:4200/exchange_token?state=&code=<TOKEN>&scope=read
    this.loggerSvc.info('Token received:', params);
    const code = params['code'];
    const scopes = params['scope'].split(',');
    if (code) {
      this.authSvc.loginLoginPost({ body: { code, scopes } }).subscribe((res) => {
        this.loggerSvc.info('Token exchanged:', res);
        this.currentToken.set(res.access_token);
      });
    }
  }
}
