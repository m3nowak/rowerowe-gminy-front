import {
  Component,
  computed,
  effect,
  ElementRef,
  EventEmitter,
  inject,
  model,
  Output,
  ViewChild,
} from '@angular/core';
import { AdmService } from '../../services/adm.service';
import { environment } from '../../../environments/environment';
import { BtnDirective } from '../../common-components/btn.directive';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { RegionsService } from '../../services/regions.service';
import { lastValueFrom } from 'rxjs';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { CustomNGXLoggerService } from 'ngx-logger';

@Component({
  selector: 'app-map-popup',
  imports: [BtnDirective, DatePipe],
  templateUrl: './map-popup.component.html',
})
export class MapPopupComponent {
  @Output() exit = new EventEmitter();

  @ViewChild('coaImage') coaImageRef!: ElementRef<HTMLImageElement>;

  admSvc = inject(AdmService);
  regionsSvc = inject(RegionsService);
  authSvc = inject(AuthService);
  loggerSvc = inject(CustomNGXLoggerService).getNewInstance({
    partialConfig: { context: 'MapPopupComponent' },
  });

  regionId = model<string | undefined>(undefined);

  previousCoaLink: string | undefined;

  regionInfo = computed(() => {
    const regionId = this.regionId();
    if (regionId) {
      return this.admSvc.getAdmInfo(regionId.replace('PL', ''));
    }
    return undefined;
  });

  coaLinkQuery = injectQuery(() => ({
    queryKey: ['coaLink', this.regionId()],
    queryFn: () => lastValueFrom(this.admSvc.getCoa(this.regionId()!.replace('PL', ''))),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!this.regionId(),
  }));

  coaLink = computed(() => {
    if (this.coaLinkQuery.status() === 'success') {
      return this.coaLinkQuery.data();
    } else if (this.coaLinkQuery.status() === 'error') {
      return '/assets/placeholders/coa-unknown-raw.webp';
    } else {
      // pending
      return '/assets/placeholders/coa-loading-raw.webp';
    }
  });

  coaLinkEffect = effect(() => {
    this.loggerSvc.info('COA link effect', this.coaLinkQuery.status());
    this.loggerSvc.info('COA link', this.coaLink());
  });

  visitInfo = injectQuery(() => ({
    queryKey: ['visitInfo', this.regionId()],
    queryFn: () => lastValueFrom(this.regionsSvc.unlockedRegionDetail(this.regionId()!)),
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: this.authSvc.isLoggedIn() && !!this.regionId(),
  }));

  // coaLink = computed(() => {
  //   const regionInfo = this.regionInfo();
  //   if (regionInfo) {
  //     if (regionInfo.coa_link) {
  //       return environment.coaBaseUrl + regionInfo.coa_link;
  //     }
  //   }
  //   return undefined;
  // });

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

  escapeMnppEffect = effect(() => {
    const regionInfo = this.regionInfo();
    if (regionInfo && regionInfo.only_child) {
      this.switchToParent();
    }
  });

  ef1 = effect(() => {
    console.log('COA', this.coaLink());
  });

  closeBtnPressed() {
    this.exit.emit();
  }

  onImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = '/assets/placeholders/coa-unknown-raw.webp';
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
