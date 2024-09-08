import { HttpClient, HttpEventType, HttpProgressEvent, HttpRequest } from '@angular/common/http';
import { computed, inject, Injectable, OnDestroy, Signal, signal } from '@angular/core';
import { filter, Observable, of, shareReplay, Subscription, switchMap, tap } from 'rxjs';
import { AdmInfo } from '../models/adm-info';
import { environment } from '../../environments/environment';
import { CustomNGXLoggerService } from 'ngx-logger';
import { LoadingInfo } from '../models/loading_info';
import { gunzip } from '../utils/gunzip';

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

  private downloadStarted = false;
  private progressSub: Subscription | undefined;
  private downloadSub: Subscription | undefined;

  startDownload() {
    if (!this.downloadStarted) {
      this.downloadStarted = true;
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
    const request = new HttpRequest<Blob>('GET', environment.admInfoUrl, {
      reportProgress: true,
      responseType: 'blob'
    });
    let request$ = this.http.request<Blob>(request).pipe(
      shareReplay(1)
    );
    this.progressSub = request$.pipe(
      filter((event) => event.type === HttpEventType.DownloadProgress)
    ).subscribe((event) => {
      let eventCast = event as HttpProgressEvent;
      let total = eventCast.total;
      if (total) {
        this._loadProgress.set({ total: total, loaded: eventCast.loaded });
      }
      this.loggerSvc.info('Download progress', eventCast.loaded, total);
    });

    this.downloadSub = request$.pipe(
      filter((event) => event.type === HttpEventType.Response),
      switchMap((event) => event.body ? gunzip<AdmInfo[]>(event.body) : of(undefined)),
      tap((ail) => {
        this.loggerSvc.info('Data received', ail);
      })
    ).subscribe((admInfoList) => {
        if (admInfoList) {
          this.admInfo.set(this.buildAdmInfoMap(admInfoList));
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
    );
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
    if (this.progressSub) {
      this.progressSub.unsubscribe();
    }
  }
}
