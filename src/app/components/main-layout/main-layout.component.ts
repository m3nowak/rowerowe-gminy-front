import { Component, inject, OnInit } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MapComponent } from '@maplibre/ngx-maplibre-gl';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MapDisplayControlComponent } from '../map-display-control/map-display-control.component';

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
    MapDisplayControlComponent
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent implements OnInit {
  drawerOpen = false;
  shapeTypeControl = new FormControl('0');
  routerSvc = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  fixFcSub: Subscription | undefined;

  toggleDrawer() {
    this.drawerOpen = !this.drawerOpen;
  }

  ngOnInit(): void {
    this.shapeTypeControl.valueChanges.subscribe((value) => {
      //add value to QS
      let qp = { detail: value };
      this.routerSvc.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: qp,
        queryParamsHandling: 'merge',
      });
    });
    this.fixFcSub = this.activatedRoute.queryParams.subscribe((params) => {
      let selectedDetail = params['detail'] ?? 0;

      this.shapeTypeControl.setValue(selectedDetail);
    });
  }
}
