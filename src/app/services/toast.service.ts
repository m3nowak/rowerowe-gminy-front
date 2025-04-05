import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  logoutToast$ = new Subject<void>();

  openLogoutToast() {
    this.logoutToast$.next();
  }
}
