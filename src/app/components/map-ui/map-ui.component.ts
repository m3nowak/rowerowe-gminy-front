import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { MapLibreComponent } from '../map-libre/map-libre.component';
import { MapPopupComponent } from '../map-popup/map-popup.component';
import { AdmService } from '../../services/adm.service';
import { BordersService } from '../../services/borders.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-map-ui',
  standalone: true,
  imports: [MapLibreComponent, MapPopupComponent, MatProgressSpinnerModule],
  templateUrl: './map-ui.component.html',
  styleUrl: './map-ui.component.scss',
})
export class MapUiComponent implements OnInit {
  admSvc = inject(AdmService);
  bordersSvc = inject(BordersService);

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
  ef1 = effect(
    () => {
      console.log('selectedRegionId', this.selectedRegionId());
    },
    { allowSignalWrites: true },
  );

  unassignRegionId() {
    this.selectedRegionId.set(undefined);
  }

  ngOnInit(): void {
    this.admSvc.startDownload();
    this.bordersSvc.startDownload();
  }
}
