import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const authSvc = inject(AuthService);
  if (authSvc.isLoggedIn() && !authSvc.isExpired()) {
    const newReq = req.clone({
      headers: req.headers.append('Authorization', `Bearer ${authSvc.authTokenGetter()}`),
    });
    return next(newReq);
  } else {
    return next(req);
  }
}
