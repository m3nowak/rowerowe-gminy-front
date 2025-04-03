import { Component, inject, input, signal, effect, OnInit, computed } from '@angular/core';
import { AthleteService } from '../../services/athlete.service';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { filter, lastValueFrom, map, startWith, switchMap, timer } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { CustomNGXLoggerService } from 'ngx-logger';
@Component({
  selector: 'app-processing-stats',
  imports: [],
  templateUrl: './processing-stats.component.html',
  styleUrls: ['./processing-stats.component.css'],
})
export class ProcessingStatsComponent implements OnInit {
  delayedStart = input<boolean>(false);
  athleteSvc = inject(AthleteService);
  private loggerSvc = inject(CustomNGXLoggerService).getNewInstance({
    partialConfig: { context: 'ProcessingStatsComponent' },
  });

  // Signal to control query enablement
  queryTrigger = signal(false);

  snf = toSignal(
    toObservable(this.queryTrigger).pipe(
      filter((val) => val === true),
      switchMap(() => timer(10 * 1000)),
      map(() => true),
      startWith(false),
    ),
  );

  queryEnabled = computed(() => this.snf() || !this.delayedStart());
  qeef = effect(() => {
    this.loggerSvc.debug('Query enabled:', this.queryEnabled());
  });

  ngOnInit() {
    this.queryTrigger.set(true); // Set to true to trigger the effect
  }

  athleteInfo = injectQuery(() => ({
    queryFn: () => lastValueFrom(this.athleteSvc.getCurrentAthlete()),
    queryKey: ['currentAthlete'],
    refetchInterval: 1000 * 20, // 20 seconds
    staleTime: 1000 * 15, // 15 seconds
    enabled: this.queryEnabled(), // Only run query when enabled
  }));
}
