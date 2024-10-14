import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RemoveQueryParamsGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (Object.keys(route.queryParams).length > 0) {
      this.router.navigate([state.url.split('?')[0]]);
      return false;
    }
    return true;
  }
}
