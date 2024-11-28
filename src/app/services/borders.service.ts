import { computed, inject, Injectable, OnDestroy, signal } from '@angular/core';
import { HttpClient, HttpEventType, HttpProgressEvent, HttpRequest } from '@angular/common/http';
import { filter, of, shareReplay, Subscription, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';

import { FeatureCollection } from 'geojson';
import { CustomNGXLoggerService } from 'ngx-logger';
import { LoadingInfo } from '../models/loading_info';
import { gunzip } from '../utils/gunzip';
import { feature } from 'topojson-client';
import { Topology } from 'topojson-specification';

@Injectable({
  providedIn: 'root',
})
export class BordersService implements OnDestroy {
  private http = inject(HttpClient);

  private loggerSvc = inject(CustomNGXLoggerService).getNewInstance({
    partialConfig: { context: 'AdmService' },
  });

  private _borderInfo = signal<FeatureCollection | undefined>(undefined);

  borderInfo = computed(() => this._borderInfo());

  isAvailable = computed(() => this._borderInfo() !== undefined);

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

  private _startDownload() {
    const request = new HttpRequest<Blob>('GET', environment.borderInfoUrl, {
      reportProgress: true,
      responseType: 'blob',
    });
    const request$ = this.http.request<Blob>(request).pipe(shareReplay(1));

    this.progressSub = request$.pipe(filter((event) => event.type === HttpEventType.DownloadProgress)).subscribe((event) => {
      const eventCast = event as HttpProgressEvent;
      const total = eventCast.total;
      if (total) {
        this._loadProgress.set({ total: total, loaded: eventCast.loaded });
      }
      this.loggerSvc.info('Download progress', eventCast.loaded, total);
    });

    this.downloadSub = request$
      .pipe(
        filter((event) => event.type === HttpEventType.Response),
        switchMap((event) => (event.body ? gunzip<Topology>(event.body) : of(undefined))),
      )
      .subscribe((tpl) => {
        this.loggerSvc.info('Download completed');
        this.loggerSvc.info(tpl);
        const fc = tpl ? (feature(tpl, tpl.objects['data']) as FeatureCollection) : undefined;
        if (fc) {
          this._borderInfo.set(fc);
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
