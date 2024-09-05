import { HttpClient, HttpEventType, HttpRequest } from '@angular/common/http';
import { computed, inject, Injectable, OnDestroy, Signal, signal } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AdmInfo } from '../models/adm-info';
import { environment } from '../../environments/environment';
import { CustomNGXLoggerService } from 'ngx-logger';

@Injectable({
  providedIn: 'root',
})
export class AdmService implements OnDestroy{

  private http = inject(HttpClient);

  private loggerSvc = inject(CustomNGXLoggerService).getNewInstance({
    partialConfig: { context: 'AdmService' },
  });

  private admInfo = signal<Map<string, AdmInfo> | undefined>(undefined);

  isAvailable = computed(() => this.admInfo() !== undefined);

  private _loadProgress = signal<number | undefined>(0);

  loadProgress = computed(() => this._loadProgress());

  private downloadSub: Subscription | undefined;

  startDownload() {
    if (!this.downloadSub) {
      this._startDownload();
    }
  }

  getAdmInfo(regionId: string): AdmInfo | undefined {
    const admInfo = this.admInfo();
    if (admInfo) {
      return admInfo.get(regionId);
    }
    return undefined;
  }

  private _startDownload() {
    const request = new HttpRequest<AdmInfo[]>('GET', environment.admInfoUrl, {
      reportProgress: true,
    });
    this.downloadSub = this.http.request<AdmInfo[]>(request).subscribe((event) => {
      if (event.type === HttpEventType.DownloadProgress) {
        let percentage = undefined;
        if (event.total) {
          percentage =  Math.floor(event.loaded / event.total * 100);
        }
        this._loadProgress.set(percentage);
        this.loggerSvc.info('Download progress', percentage);
      }
      if (event.type === HttpEventType.Response) {
        if (event.body) {
          this.admInfo.set(this.buildAdmInfoMap(event.body));
          this.youForgotPoland();
          this._loadProgress.set(100);
        }
        else {
          this.loggerSvc.error('No data received');
        }
      }
    });
  }
  private buildAdmInfoMap(admInfo: AdmInfo[]): Map<string, AdmInfo> {
    return new Map(admInfo.map((ai) => [ai.TERYT, ai]));
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
          coa_link: 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Herb_Polski.svg',
          is_mnpp: false,
          type: 'PAN',
        });
      }
      return admInfo;
    })
  }

  ngOnDestroy(): void {
    if (this.downloadSub) {
      this.downloadSub.unsubscribe();
    }
  }
}
