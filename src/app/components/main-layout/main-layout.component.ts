import { Component, inject } from '@angular/core';

import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { tablerLogin, tablerLogout, tablerMenu2, tablerUser } from '@ng-icons/tabler-icons';
import { StravaBtnComponent } from '../../common-components/strava-btn/strava-btn.component';
import { BtnDirective } from '../../common-components/btn.directive';
@Component({
  selector: 'app-main-layout',
  imports: [NgIconComponent, StravaBtnComponent, BtnDirective, RouterLink],
  providers: [provideIcons({ tablerLogout, tablerLogin, tablerMenu2, tablerUser })],
  templateUrl: './main-layout.component.html',
})
export class MainLayoutComponent {
  drawerOpen = false;
  // shapeTypeControl = new FormControl('0');
  routerSvc = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  stravaAuthSvc = inject(AuthService);

  fixFcSub: Subscription | undefined;

  toggleDrawer() {
    this.drawerOpen = !this.drawerOpen;
  }
}
