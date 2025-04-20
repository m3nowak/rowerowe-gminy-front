import { Component, computed, effect, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { UserAccountService } from '../../services/user-account.service';
import { injectMutation, injectQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { BtnDirective } from '../../common-components/btn.directive';
import { CustomNGXLoggerService } from 'ngx-logger';
import { UserSettings, UserSettingsPartial } from '../../models/user';
import { AlertComponent } from '../../common-components/alert/alert.component';

@Component({
  selector: 'app-user-settings',
  imports: [ReactiveFormsModule, BtnDirective, AlertComponent],
  templateUrl: './user-settings.component.html',
  styleUrl: './user-settings.component.css',
})
export class UserSettingsComponent {
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
      this.descUpdateOption.disable();
    } else {
      this.descUpdateOption.enable();
    }
    this.loggerSvc.debug('Form blocked:', this.formBlocked());
  });

  rejectChanges() {
    //this.queryClient.invalidateQueries({ queryKey: ['userSettings'] });
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
}
