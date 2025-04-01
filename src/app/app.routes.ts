import { Routes } from '@angular/router';
import { WelcomeScreenComponent } from './pages/welcome-screen/welcome-screen.component';
import { RemoveQueryParamsGuard } from './guards/remove-query-params.guard';
import { LoginPurgatoryComponent } from './pages/login-purgatory/login-purgatory.component';
import { UserPageComponent } from './pages/user-page/user-page.component';
import { AboutPageComponent } from './pages/about-page/about-page.component';
import { TosPageComponent } from './pages/tos-page/tos-page.component';
import { PrivacyPageComponent } from './pages/privacy-page/privacy-page.component';
import { GdprPageComponent } from './pages/gdpr-page/gdpr-page.component';
import { UserLoggedInGuard } from './guards/user-logged-in.guard';

export const routes: Routes = [
  {
    path: 'authorized',
    component: LoginPurgatoryComponent,
  },
  { path: 'user', component: UserPageComponent },
  {
    path: 'home',
    loadComponent: () => import('./pages/map-ui/map-ui.component').then((m) => m.MapUiComponent),
    canActivate: [UserLoggedInGuard, RemoveQueryParamsGuard],
  },
  { path: '', component: WelcomeScreenComponent },
  { path: 'about', component: AboutPageComponent },
  { path: 'about/tos', component: TosPageComponent },
  { path: 'about/privacy', component: PrivacyPageComponent },
  { path: 'about/gdpr', component: GdprPageComponent },
];
