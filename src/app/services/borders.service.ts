import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpEventType, HttpRequest } from '@angular/common/http';
import { map, Observable, Subscription } from 'rxjs';
import { environment } from '../../environments/environment';

import { GeoJsonTypes, FeatureCollection } from 'geojson';
import { CustomNGXLoggerService } from 'ngx-logger';
import { LoadingInfo } from '../models/loading_info';

@Injectable({
  providedIn: 'root',
})
export class BordersService {
  private http = inject(HttpClient);

  private loggerSvc = inject(CustomNGXLoggerService).getNewInstance({
    partialConfig: { context: 'AdmService' },
  });

  private _borderInfo = signal<FeatureCollection | undefined>(undefined);

  borderInfo = computed(() => this._borderInfo());

  isAvailable = computed(() => this._borderInfo() !== undefined);

  private _loadProgress = signal<LoadingInfo>({total: 1, loaded: 1});

  loadProgress = computed(() => this._loadProgress());

  private downloadSub: Subscription | undefined;

  startDownload() {
    if (!this.downloadSub) {
      this._startDownload();
    }
  }

  private _startDownload() {
    const request = new HttpRequest<FeatureCollection>('GET', environment.borderInfoUrl, {
      reportProgress: true,
    });
    this.downloadSub = this.http.request<FeatureCollection>(request).subscribe((event) => {
      if (event.type === HttpEventType.DownloadProgress) {
        let total = event.total || event.loaded  ;
        this._loadProgress.set({total: total, loaded: event.loaded});
        this.loggerSvc.info('Download progress', event.loaded, total);
      }
      if (event.type === HttpEventType.Response) {
        if (event.body) {
          this._borderInfo.set(event.body);
          this._loadProgress.update((lp) => ({total: lp.total, loaded: lp.total}));
        } else {
          this.loggerSvc.error('No data received');
        }
      }
    });
  }
}
