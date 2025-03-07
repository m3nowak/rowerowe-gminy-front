import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { MapLibreComponent } from '../../components/map-libre/map-libre.component';
import { MapPopupComponent } from '../../components/map-popup/map-popup.component';
import { AdmService } from '../../services/adm.service';
import { BordersService } from '../../services/borders.service';
import { ProgressComponent } from '../../common-components/progress/progress.component';
import { FirstLoginModalComponent } from '../../components/first-login-modal/first-login-modal.component';
import { ActivatedRoute } from '@angular/router';
import { CustomNGXLoggerService } from 'ngx-logger';
import { UserStateService } from '../../services/user-state.service';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-map-ui',
  imports: [MapLibreComponent, MapPopupComponent, ProgressComponent, FirstLoginModalComponent],
  templateUrl: './map-ui.component.html',
})
export class MapUiComponent implements OnInit {
  @ViewChild('map', { static: false }) mapElement!: MapLibreComponent;

  admSvc = inject(AdmService);
  bordersSvc = inject(BordersService);
  route = inject(ActivatedRoute);
  userStateSvc = inject(UserStateService);
  loggerSvc = inject(CustomNGXLoggerService).getNewInstance({
    partialConfig: { context: 'LoginPurgatory' },
  });

  selectedRegionId = signal<string | undefined>(undefined);

  loadProgressPercent = computed(() => {
    const lp1 = this.admSvc.loadProgress();
    const lp2 = this.bordersSvc.loadProgress();
    if (lp1 && lp2) {
      return Math.round(((lp1.loaded + lp2.loaded) / (lp1.total + lp2.total)) * 100);
    } else {
      return undefined;
    }
  });

  dataAvailable = computed(() => this.admSvc.isAvailable() && this.bordersSvc.isAvailable());

  showPopup = computed(() => this.selectedRegionId() !== undefined);
  ef1 = effect(() => {
    console.log('selectedRegionId', this.selectedRegionId());
  });

  unassignRegionId() {
    this.selectedRegionId.set(undefined);
  }

  regionFocused() {
    const regionId = this.selectedRegionId();
    if (regionId) {
      this.loggerSvc.info('regionFocused', regionId);
      this.mapElement.fitMapToRegion(regionId, 50);
    }
  }

  ngOnInit(): void {
    this.admSvc.startDownload();
    this.bordersSvc.startDownload();
  }
}
