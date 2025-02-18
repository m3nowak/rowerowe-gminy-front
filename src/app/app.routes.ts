import { Routes } from '@angular/router';
import { WelcomeScreenComponent } from './components/welcome-screen/welcome-screen.component';
import { RemoveQueryParamsGuard } from './guards/remove-query-params.guard';
import { LoginPurgatoryComponent } from './components/login-purgatory/login-purgatory.component';

export const routes: Routes = [
  {
    path: 'authorized',
    component: LoginPurgatoryComponent,
  },
  { path: 'home', loadComponent: () => import('./components/map-ui/map-ui.component').then((m) => m.MapUiComponent), canActivate: [RemoveQueryParamsGuard] },
  { path: '', component: WelcomeScreenComponent },
];
