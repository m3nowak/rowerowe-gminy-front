import { Component, computed, effect, inject, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { UserAccountService } from '../../services/user-account.service';
import { injectMutation, injectQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { filter, lastValueFrom, tap } from 'rxjs';
import { BtnDirective } from '../../common-components/btn.directive';
import { CustomNGXLoggerService } from 'ngx-logger';
import { UserSettings, UserSettingsPartial } from '../../models/user';
import { AlertComponent } from '../../common-components/alert/alert.component';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-user-settings',
  imports: [ReactiveFormsModule, BtnDirective, AlertComponent],
  templateUrl: './user-settings.component.html',
  styleUrl: './user-settings.component.css',
})
export class UserSettingsComponent {
  updateOnChange = input.required<boolean>();

  queryClient = inject(QueryClient);
  userAccountSvc = inject(UserAccountService);
  private loggerSvc = inject(CustomNGXLoggerService).getNewInstance({
    partialConfig: { context: 'UserSettingsComponent' },
  });

  userSettingsQuery = injectQuery(() => ({
    queryKey: ['userSettings'],
    queryFn: () => lastValueFrom(this.userAccountSvc.getUserSettings()),
  }));

  userSettingsMutation = injectMutation(() => ({
    mutationFn: (userSettingsP: UserSettingsPartial) =>
      lastValueFrom(this.userAccountSvc.updateUserSettings(userSettingsP)),
    onSuccess: () => {
      this.queryClient.invalidateQueries({ queryKey: ['userSettings'] });
    },
  }));

  private setFormValues(userSettings: UserSettings) {
    this.descUpdateOption.setValue(userSettings.updateStravaDesc);
  }

  userSettingsLoadEffect = effect(() => {
    this.loggerSvc.debug('User settings query status:', this.userSettingsQuery.status());
    if (this.userSettingsQuery.isSuccess()) {
      this.setFormValues(this.userSettingsQuery.data());
    }
  });

  formBlocked = computed(
    () => this.userSettingsQuery.isLoading() || this.userSettingsMutation.isPending(),
  );

  formBlockedEffect = effect(() => {
    if (this.formBlocked()) {
      this.descUpdateOption.disable({ emitEvent: false });
    } else {
      this.descUpdateOption.enable({ emitEvent: false });
    }
    this.loggerSvc.debug('Form blocked:', this.formBlocked());
  });

  rejectChanges() {
    this.loggerSvc.debug('Changes rejected');
    if (this.userSettingsQuery.isSuccess()) {
      this.setFormValues(this.userSettingsQuery.data());
    }
  }

  acceptChanges() {
    this.loggerSvc.debug('Changes accepted');
    this.loggerSvc.debug('Desc update option:', this.descUpdateOption.value ?? undefined);
    const userSettings: UserSettingsPartial = {
      updateStravaDesc: this.descUpdateOption.value ?? undefined,
    };
    this.userSettingsMutation.mutate(userSettings);
  }

  descUpdateOption = new FormControl(0);

  descUpdateOptionChanged = toSignal(
    this.descUpdateOption.valueChanges.pipe(
      tap(() => {
        this.loggerSvc.debug('Desc update option changed:', this.descUpdateOption.value);
      }),
      filter((value) => {
        const usq = this.userSettingsQuery.data();
        return value !== undefined && usq !== undefined && value !== usq.updateStravaDesc;
      }),
    ),
  );

  descUpdateOptionChangedEffect = effect(() => {
    if (this.updateOnChange()) {
      this.descUpdateOptionChanged();
      this.acceptChanges();
    }
  });
}
