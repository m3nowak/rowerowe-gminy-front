import { Routes } from '@angular/router';
import { MapUiComponent } from './components/map-ui/map-ui.component';
import { StravaAuthService } from './services/strava-auth.service';
import { inject } from '@angular/core';
import { WelcomeScreenComponent } from './components/welcome-screen/welcome-screen.component';
import { RemoveQueryParamsGuard } from './guards/remove-query-params.guard';
import { LoginPurgatoryComponent } from './components/login-purgatory/login-purgatory.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginPurgatoryComponent,
  },
  {
    path: 'authorized',
    redirectTo: ({ queryParams }) => {
      let extAuthSvc = inject(StravaAuthService);
      extAuthSvc.feedToken(queryParams);
      return 'home';
    },
  },
  { path: 'home', loadComponent: () => import('./components/map-ui/map-ui.component').then((m) => m.MapUiComponent), canActivate: [RemoveQueryParamsGuard] },
  { path: '', component: WelcomeScreenComponent },
];
