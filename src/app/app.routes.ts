import { Routes } from '@angular/router';
import { WelcomeScreenComponent } from './pages/welcome-screen/welcome-screen.component';
import { RemoveQueryParamsGuard } from './guards/remove-query-params.guard';
import { LoginPurgatoryComponent } from './pages/login-purgatory/login-purgatory.component';
import { UserPageComponent } from './pages/user-page/user-page.component';

export const routes: Routes = [
  {
    path: 'authorized',
    component: LoginPurgatoryComponent,
  },
  { path: 'user', component: UserPageComponent },
  {
    path: 'home',
    loadComponent: () => import('./pages/map-ui/map-ui.component').then((m) => m.MapUiComponent),
    canActivate: [RemoveQueryParamsGuard],
  },
  { path: '', component: WelcomeScreenComponent },
];
