import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CustomNGXLoggerService } from 'ngx-logger';
import { environment } from '../../environments/environment';
import { AuthService as ApiAuthService } from '../api/services';
import * as jose from 'jose';
import { DateTime } from 'luxon';
import { LoginResponseError, StravaScopes } from '../api/models';
import { catchError, filter, map, Observable, switchMap, timer } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import posthog from 'posthog-js';
//import { CookieService } from 'ngx-cookie-service';
import { toObservable } from '@angular/core/rxjs-interop';
import { ToastService } from './toast.service';

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
    partialConfig: { context: 'AuthService' },
  });
  authSvc = inject(ApiAuthService);
  toastSvc = inject(ToastService);
  router = inject(Router);
  // cookieSvc = inject(CookieService);

  private authToken = signal<string | undefined>(undefined);
  authTokenGetter = computed(() => this.authToken());

  private getTokenExp(token: string) {
    if (!token) return undefined;
    const decoded = jose.decodeJwt(token);
    if (decoded && decoded.exp) {
      const expiration = DateTime.fromSeconds(decoded.exp).toUTC();
      return expiration;
    }
    return undefined;
  }

  private isTokenExpired(token: string) {
    const expiration = this.getTokenExp(token);
    if (!expiration) return true;
    const now = DateTime.utc();
    return expiration < now;
  }

  constructor() {
    this.loggerSvc.debug('AuthService initialized');
    const tokenFromStorage = localStorage.getItem(TOKEN_KEY);
    if (tokenFromStorage) {
      if (!this.isTokenExpired(tokenFromStorage)) {
        this.authToken.set(tokenFromStorage);
      } else {
        this.toastSvc.openLogoutToast();
      }
    }
  }

  currentAuthInfo = computed<AuthInfo | undefined>(() => {
    const token = this.authToken();
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

  private posthogAuthEffect = effect(() => {
    const authInfo = this.currentAuthInfo();
    if (authInfo) {
      posthog.identify(authInfo.stravaId.toString(), {
        username: authInfo.stravaUsername,
      });
    } else {
      posthog.reset();
    }
  });

  private localStorageEffect = effect(() => {
    const token = this.authToken();
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      // this.cookieSvc.set(
      //   TOKEN_KEY,
      //   token,
      //   expiration!.toJSDate(),
      //   '/',
      //   undefined,
      //   environment.production,
      //   'Strict',
      // );
    } else {
      // this.cookieSvc.delete(TOKEN_KEY);
      localStorage.removeItem(TOKEN_KEY);
    }
  });

  loginExpiresAt = computed(() => {
    const token = this.authToken();
    if (!token) return undefined;
    const decoded = jose.decodeJwt(token);
    if (decoded && decoded.exp) {
      const expiration = DateTime.fromSeconds(decoded.exp);
      return expiration;
    }
    return undefined;
  });

  private expirationObservable = toObservable(this.loginExpiresAt).pipe(
    filter((val) => val !== undefined),
    switchMap((val) => {
      this.loggerSvc.debug('Will be revoked at:', val.toString());
      return timer(val.toJSDate());
    }),
  );

  private expirationSub = this.expirationObservable.subscribe(() => {
    this.loggerSvc.info('Token expired');
    this.authToken.set(undefined);
    this.router.navigate(['']);
    this.toastSvc.openLogoutToast();
  });

  isLoggedIn = computed(() => this.authToken() !== undefined && !this.isExpired());

  scopes = computed<string[]>(() => {
    const token = this.authToken();
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
    this.authToken.set(undefined);
    this.router.navigate(['']);
  }

  dumpTokenInfo() {
    const token = this.authToken();
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
        this.authToken.set(res.access_token);
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
}
