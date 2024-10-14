import { Component, computed, effect, EventEmitter, inject, input, model, Output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AdmService } from '../../services/adm.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-map-popup',
  standalone: true,
  imports: [MatCardModule, MatButton],
  templateUrl: './map-popup.component.html',
  styleUrl: './map-popup.component.scss',
})
export class MapPopupComponent {
  @Output() close = new EventEmitter();

  admSvc = inject(AdmService);

  regionId = model<string | undefined>(undefined);

  regionInfo = computed(() => {
    let regionId = this.regionId();
    if (regionId) {
      return this.admSvc.getAdmInfo(regionId);
    }
    return undefined;
  });

  coaLink = computed(() => {
    let regionInfo = this.regionInfo();
    if (regionInfo) {
      if (regionInfo.coa_link) {
        return environment.coaBaseUrl + regionInfo.coa_link;
      }
    }
    return undefined;
  });

  typeInfoExt = computed(() => {
    switch (this.regionInfo()?.type) {
      case 'PAN':
        return 'państwo';
      case 'POW':
        return 'powiat';
      case 'GMI':
        return 'gmina';
      case 'WOJ':
        return 'województwo';
      default:
        return '';
    }
  });

  subtypeInfoExt = computed(() => {
    if (this.regionInfo()?.subtypeDigit) {
      switch (this.regionInfo()?.subtypeDigit) {
        case 1:
          return 'gmina miejska';
        case 2:
          return 'gmina wiejska';
        case 3:
          return 'gmina miejsko-wiejska';
        default:
          return undefined;
      }
    } else if (this.regionInfo()?.type === 'POW' && this.regionInfo()?.has_one_child) {
      return 'miasto powiat';
    } else {
      return undefined;
    }
  });

  escapeMnppEffect = effect(
    () => {
      let regionInfo = this.regionInfo();
      if (regionInfo && regionInfo.only_child) {
        this.switchToParent();
      }
    },
    { allowSignalWrites: true },
  );

  ef1 = effect(() => {
    console.log('COA', this.coaLink());
  });

  closeBtnPressed() {
    this.close.emit();
  }

  switchToParent() {
    let regionId = this.regionId();
    if (regionId) {
      let length = regionId.length;
      switch (length) {
        case 2:
          this.regionId.set('0');
          break;
        case 4:
          this.regionId.set(regionId.substring(0, 2));
          break;
        case 7:
          this.regionId.set(regionId.substring(0, 4));
          break;
        default:
          break;
      }
    }
  }
}
