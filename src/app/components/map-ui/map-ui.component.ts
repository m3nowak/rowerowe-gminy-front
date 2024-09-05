import { Component, computed, effect, HostBinding, inject, model, OnInit, signal } from '@angular/core';
import { MapLibreComponent } from '../map-libre/map-libre.component';
import { MapPopupComponent } from '../map-popup/map-popup.component';
import { AdmService } from '../../services/adm.service';

@Component({
  selector: 'app-map-ui',
  standalone: true,
  imports: [MapLibreComponent, MapPopupComponent],
  templateUrl: './map-ui.component.html',
  styleUrl: './map-ui.component.scss',
})
export class MapUiComponent implements OnInit {
  @HostBinding('class') class = 'h-flex-content h-flex-container';

  admSvc = inject(AdmService);

  selectedRegionId = signal<string | undefined>(undefined);
  showPopup = computed(() => this.selectedRegionId() !== undefined);
  ef1 = effect(
    () => {
      console.log('selectedRegionId', this.selectedRegionId());
    },
    { allowSignalWrites: true }
  );

  unassignRegionId() {
    this.selectedRegionId.set(undefined);
  }

  ngOnInit(): void {
    this.admSvc.startDownload();
  }
}
