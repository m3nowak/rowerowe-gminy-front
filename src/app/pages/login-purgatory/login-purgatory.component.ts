import { Component, inject, computed, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ProgressComponent } from '../../common-components/progress/progress.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StravaBtnComponent } from '../../common-components/strava-btn/strava-btn.component';
import { injectMutation } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { CustomNGXLoggerService } from 'ngx-logger';
import { AthleteService } from '../../services/athlete.service';
import { UserStateService } from '../../services/user-state.service';
import { AlertComponent } from '../../common-components/alert/alert.component';
import { BtnDirective } from '../../common-components/btn.directive';

@Component({
  selector: 'app-login-purgatory',
  imports: [ProgressComponent, StravaBtnComponent, AlertComponent, BtnDirective, RouterLink],
  templateUrl: './login-purgatory.component.html',
})
export class LoginPurgatoryComponent {
  extAuthSvc = inject(AuthService);
  athleteSvc = inject(AthleteService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  userStateSvc = inject(UserStateService);
  loggerSvc = inject(CustomNGXLoggerService).getNewInstance({
    partialConfig: { context: 'LoginPurgatory' },
  });

  tosAccepted = signal(false);

  loginMutation = injectMutation(() => ({
    mutationFn: (params: { code: string; scope: string }) =>
      lastValueFrom(this.extAuthSvc.feedTokenResposive(params.code, params.scope)),
    onError: (error) => {
      this.loggerSvc.error(`Failed to login: ${error}`);
    },
    onSuccess: (authResp) => {
      if (!authResp.success) {
        this.loggerSvc.error(`Failed to login: ${authResp.errorCode}`);
        return;
      }
      const isFirstLogin = authResp.isFirstLogin;
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

  sufficentParams = computed(() => {
    return this.queryParams()?.get('code') !== null && this.queryParams()?.get('scope') !== null;
  });

  pageState = computed(() => {
    if (!this.sufficentParams()) {
      return 'error';
    } else if (!this.tosAccepted()) {
      return 'pending';
    } else if (this.loginMutation.isError()) {
      return 'error';
    } else if (this.loginMutation.isSuccess()) {
      if (this.loginMutation.data().success) {
        return 'redirecting';
      } else {
        return 'error';
      }
    } else if (this.loginMutation.isPending()) {
      return 'loading';
    } else {
      // Something broke, possibly mutation didn't trigger
      return 'error';
    }
  });

  errorInfo = computed(() => {
    if (this.loginMutation.isSuccess()) {
      const successData = this.loginMutation.data();
      if (!successData.success) {
        return successData.errorCode;
      }
    }
    return undefined;
  });

  acceptTos() {
    this.tosAccepted.set(true);
    if (this.sufficentParams()) {
      this.loggerSvc.info('Sufficent params, triggering login mutation');
      const code = this.route.snapshot.queryParamMap.get('code')!;
      const scope = this.route.snapshot.queryParamMap.get('scope')!;
      this.loginMutation.mutate({ code, scope });
    }
  }
}
