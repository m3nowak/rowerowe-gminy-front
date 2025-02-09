import { Component, computed, effect, EventEmitter, inject, model, Output } from '@angular/core';
import { AdmService } from '../../services/adm.service';
import { environment } from '../../../environments/environment';
import { BtnDirective } from '../../common-components/btn.directive';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { RegionsService } from '../../services/regions.service';
import { lastValueFrom } from 'rxjs';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-map-popup',
  standalone: true,
  imports: [BtnDirective, DatePipe],
  templateUrl: './map-popup.component.html',
  styleUrl: './map-popup.component.scss',
})
export class MapPopupComponent {
  @Output() exit = new EventEmitter();

  admSvc = inject(AdmService);
  regionsSvc = inject(RegionsService);
  authSvc = inject(AuthService);

  regionId = model<string | undefined>(undefined);

  regionInfo = computed(() => {
    const regionId = this.regionId();
    if (regionId) {
      return this.admSvc.getAdmInfo(regionId.replace('PL', ''));
    }
    return undefined;
  });

  visitInfo = injectQuery(() => ({
    queryKey: ['visitInfo', this.regionId()],
    queryFn: () => lastValueFrom(this.regionsSvc.unlockedRegionDetail(this.regionId()!)),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: this.authSvc.isLoggedIn() && !!this.regionId(),
  }));

  coaLink = computed(() => {
    const regionInfo = this.regionInfo();
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
      const regionInfo = this.regionInfo();
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
    this.exit.emit();
  }

  switchToParent() {
    const regionId = this.regionId();
    if (regionId) {
      const length = regionId.length;
      switch (length) {
        case 4:
          this.regionId.set('PL');
          break;
        case 6:
          this.regionId.set(regionId.substring(0, 4));
          break;
        case 9:
          this.regionId.set(regionId.substring(0, 6));
          break;
        default:
          break;
      }
    }
  }
}
