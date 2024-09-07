import { Component, computed, effect, EventEmitter, inject, input, model, Output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AdmService } from '../../services/adm.service';

@Component({
  selector: 'app-map-popup',
  standalone: true,
  imports: [MatCardModule, MatButton],
  templateUrl: './map-popup.component.html',
  styleUrl: './map-popup.component.scss'
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
  })

  coaLink = computed(() => {
    let regionInfo = this.regionInfo();
    if (regionInfo) {
      if (regionInfo.coa_link) {
        return regionInfo.coa_link;
      }
      else {
        return 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Blank_shield_with_border.svg'
      }
    }
    return undefined;
  })

  typeInfoExt = computed(() => {
    switch (this.regionInfo()?.type) {
      case 'PAN':
        return 'Państwo';
      case 'POW':
        return 'Powiat';
      case 'GMI':
        return 'Gmina';
      case 'WOJ':
        return 'Województwo';
      default:
        return '';
  }})

  subtypeInfoExt = computed(() => {
    switch (this.regionInfo()?.subtypeDigit) {
      case 1:
        return 'gmina miejska';
      case 2:
        return 'gmina wiejska';
      case 3:
        return 'gmina miejsko-wiejska';
      default:
        return undefined;
  }})

  escapeMnppEffect = effect(() => {
    let regionInfo = this.regionInfo();
    if (regionInfo && regionInfo.is_mnpp) {
      this.switchToParent();
    }
  }, { allowSignalWrites: true });

  ef1 = effect(() => {
    console.log('COA', this.coaLink());
  })

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
