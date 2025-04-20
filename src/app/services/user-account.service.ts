import { inject, Injectable } from '@angular/core';
import { UserService } from '../api/services';
import { map, Observable } from 'rxjs';
import { UserSettings, UserSettingsPartial } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserAccountService {
  private apiUserSvc = inject(UserService);

  deleteAccount(): Observable<void> {
    return this.apiUserSvc.deleteAccountUserDelete({}).pipe(
      map((resp) => {
        if (resp === 'ERROR') {
          throw new Error('Error deleting account');
        }
      }),
    );
  }

  getUserSettings(): Observable<UserSettings> {
    return this.apiUserSvc
      .getUserSettingsUserSettingsGet()
      .pipe(map((resp) => ({ updateStravaDesc: resp.updateStravaDesc })));
  }

  updateUserSettings(settings: UserSettingsPartial): Observable<void> {
    return this.apiUserSvc
      .updateUserSettingsUserSettingsPatch({
        body: {
          updateStravaDesc: settings.updateStravaDesc,
        },
      })
      .pipe(
        map((resp) => {
          if (resp === 'ERROR') {
            throw new Error('Error updating user settings');
          }
        }),
      );
  }
}
