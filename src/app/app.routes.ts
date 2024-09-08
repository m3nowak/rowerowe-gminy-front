import { Routes, UrlTree } from '@angular/router';
import { MapLibreComponent } from './components/map-libre/map-libre.component';
import { MapUiComponent } from './components/map-ui/map-ui.component';
import { ExtAuthService } from './services/ext-auth.service';
import { inject } from '@angular/core';

export const routes: Routes = [
  {
    path: 'authorized',
    redirectTo: ({ queryParams }) => {
      let extAuthSvc = inject(ExtAuthService);
      extAuthSvc.feedToken(queryParams);
      let rdr = new UrlTree();
      return rdr;
    },
  },
  { path: '', component: MapUiComponent },
];
