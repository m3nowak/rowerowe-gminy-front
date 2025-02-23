import { Injectable, signal } from '@angular/core';
import { DateTime } from 'luxon';

@Injectable({
  providedIn: 'root',
})
export class UserStateService {
  isFirstLogin = signal(false);
  firstLoginImportDateHint = signal<DateTime | undefined>(undefined);

  markFirstLogin(hint: DateTime) {
    this.isFirstLogin.set(true);
    this.firstLoginImportDateHint.set(hint);
  }

  unmarkFirstLogin() {
    this.isFirstLogin.set(false);
    this.firstLoginImportDateHint.set(undefined);
  }
}
