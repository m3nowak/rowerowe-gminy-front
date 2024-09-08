import { HttpClient, HttpEventType, HttpRequest } from '@angular/common/http';
import { computed, inject, Injectable, OnDestroy, Signal, signal } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AdmInfo } from '../models/adm-info';
import { environment } from '../../environments/environment';
import { CustomNGXLoggerService } from 'ngx-logger';
import { LoadingInfo } from '../models/loading_info';

@Injectable({
  providedIn: 'root',
})
export class AdmService implements OnDestroy {
  private http = inject(HttpClient);

  private loggerSvc = inject(CustomNGXLoggerService).getNewInstance({
    partialConfig: { context: 'AdmService' },
  });

  private admInfo = signal<Map<string, AdmInfo> | undefined>(undefined);

  isAvailable = computed(() => this.admInfo() !== undefined);

  private _loadProgress = signal<LoadingInfo | undefined>(undefined);

  loadProgress = computed(() => this._loadProgress());

  private downloadSub: Subscription | undefined;

  startDownload() {
    if (!this.downloadSub) {
      this._startDownload();
    }
  }

  getAdmInfo(regionId: string): AdmInfo | undefined {
    const admInfo = this.admInfo();
    let regionIdshort = regionId.substring(0, 6);
    if (admInfo) {
      return admInfo.get(regionIdshort);
    }
    return undefined;
  }

  private _startDownload() {
    const request = new HttpRequest<AdmInfo[]>('GET', environment.admInfoUrl, {
      reportProgress: true,
    });
    this.downloadSub = this.http.request<AdmInfo[]>(request).subscribe((event) => {
      if (event.type === HttpEventType.DownloadProgress) {
        let total = event.total;
        if (total) {
          this._loadProgress.set({ total: total, loaded: event.loaded });
        }
        this.loggerSvc.info('Download progress', event.loaded, total);
      }
      if (event.type === HttpEventType.Response) {
        if (event.body) {
          this.admInfo.set(this.buildAdmInfoMap(event.body));
          this.youForgotPoland();
          this._loadProgress.update((lp) => {
            if (lp) {
              return { total: lp.total, loaded: lp.total };
            } else {
              return lp;
            }
          });
        } else {
          this.loggerSvc.error('No data received');
        }
      }
    });
  }
  private buildAdmInfoMap(admInfo: AdmInfo[]): Map<string, AdmInfo> {
    return new Map(
      admInfo.map((ai) => {
        let teryt = ai.TERYT;
        let typeDigit = undefined;
        if (teryt.length === 7) {
          typeDigit = Number(teryt[teryt.length - 1]);
          teryt = teryt.substring(0, 6);
        }
        return [teryt, { ...ai, subtypeDigit: typeDigit }];
      })
    );
  }

  private youForgotPoland() {
    this.admInfo.update((admInfo) => {
      if (admInfo) {
        admInfo.set('0', {
          TERYT: '0',
          name: 'Polska',
          area: 312696,
          population: 37636508,
          link: 'wiki/Polska',
          coa_link: '0.svg',
          type: 'PAN',
          has_one_child: false,
          only_child: false,
        });
      }
      return admInfo;
    });
  }

  ngOnDestroy(): void {
    if (this.downloadSub) {
      this.downloadSub.unsubscribe();
    }
  }
}
