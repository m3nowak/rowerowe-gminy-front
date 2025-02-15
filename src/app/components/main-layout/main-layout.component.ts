import { Component, inject } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { tablerLogin, tablerLogout, tablerMenu2 } from '@ng-icons/tabler-icons';
import { StravaBtnComponent } from '../../common-components/strava-btn/strava-btn.component';
import { BtnDirective } from '../../common-components/btn.directive';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [NgIconComponent, StravaBtnComponent, BtnDirective],
  providers: [provideIcons({ tablerLogout, tablerLogin, tablerMenu2 })],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
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
