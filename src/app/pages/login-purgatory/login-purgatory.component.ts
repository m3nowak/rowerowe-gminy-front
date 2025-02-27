import { Component, inject, signal, OnInit, computed, effect } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ProgressComponent } from '../../common-components/progress/progress.component';
import { ActivatedRoute, Router } from '@angular/router';
import { StravaBtnComponent } from '../../common-components/strava-btn/strava-btn.component';
import { injectMutation } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { CustomNGXLoggerService } from 'ngx-logger';
import { AthleteService } from '../../services/athlete.service';
import { UserStateService } from '../../services/user-state.service';

@Component({
  selector: 'app-login-purgatory',
  imports: [ProgressComponent, StravaBtnComponent],
  templateUrl: './login-purgatory.component.html',
})
export class LoginPurgatoryComponent implements OnInit {
  extAuthSvc = inject(AuthService);
  athleteSvc = inject(AthleteService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  userStateSvc = inject(UserStateService);
  loggerSvc = inject(CustomNGXLoggerService).getNewInstance({
    partialConfig: { context: 'LoginPurgatory' },
  });

  willRedirect = signal(false);

  loginMutation = injectMutation(() => ({
    mutationFn: (params: { code: string; scope: string }) =>
      lastValueFrom(this.extAuthSvc.feedTokenResposive(params.code, params.scope)),
    onSuccess: (isFirstLogin) => {
      this.loggerSvc.info('Not first login, redirecting to home');
      if (isFirstLogin) {
        this.userStateSvc.markFirstLogin();
      } else {
        this.userStateSvc.unmarkFirstLogin();
      }

      this.router.navigate(['home']);
    },
  }));

  queryParams = toSignal(this.route.queryParamMap);

  loginPending = computed(() => {
    return (
      this.queryParams()?.get('code') &&
      this.queryParams()?.get('scope') &&
      !this.loginMutation.isError()
    );
  });

  lmEffect = effect(() => {
    this.loggerSvc.info(`LM State: ${this.loginMutation.status()}`);
  });

  ngOnInit() {
    const code = this.route.snapshot.queryParamMap.get('code');
    const scope = this.route.snapshot.queryParamMap.get('scope');
    if (code && scope) {
      this.loginMutation.mutate({ code, scope });
    } else {
      this.willRedirect.set(this.extAuthSvc.isLoggedIn() && !this.extAuthSvc.isExpired());
      if (this.willRedirect()) {
        this.loggerSvc.info('Already logged in, redirecting to home');
        this.userStateSvc.unmarkFirstLogin();
        this.router.navigate(['home']);
      }
    }
  }
}
