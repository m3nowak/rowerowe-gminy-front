import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserStateService {
  isFirstLogin = signal(false);

  markFirstLogin() {
    this.isFirstLogin.set(true);
  }

  unmarkFirstLogin() {
    this.isFirstLogin.set(false);
  }
}
