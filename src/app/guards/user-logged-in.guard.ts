import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserLoggedInGuard implements CanActivate {
  authSvc = inject(AuthService);
  router = inject(Router);

  canActivate(): boolean {
    const isLoggedIn = this.authSvc.isLoggedIn();

    // Check if user is logged in
    if (!isLoggedIn) {
      // Redirect to homepage if not logged in
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}
