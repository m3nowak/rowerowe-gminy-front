import { Component, inject } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MapComponent } from '@maplibre/ngx-maplibre-gl';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MapDisplayControlComponent } from '../map-display-control/map-display-control.component';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthService } from '../../services/auth.service';
import { ButtonComponent } from '../../common-components/button/button.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MapComponent,
    RouterLink,
    RouterLinkActive,
    MatButtonToggleModule,
    ReactiveFormsModule,
    MapDisplayControlComponent,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    ButtonComponent,
  ],
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
