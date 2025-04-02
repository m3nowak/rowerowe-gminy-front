import { Component, inject } from '@angular/core';
import { AthleteService } from '../../services/athlete.service';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';

@Component({
  selector: 'app-processing-stats',
  imports: [],
  templateUrl: './processing-stats.component.html',
  styleUrl: './processing-stats.component.css',
})
export class ProcessingStatsComponent {
  athleteSvc = inject(AthleteService);

  athleteInfo = injectQuery(() => ({
    queryFn: () => lastValueFrom(this.athleteSvc.getCurrentAthlete()),
    queryKey: ['currentAthlete'],
    refetchInterval: 1000 * 20, // 20 seconds
    staleTime: 1000 * 15, // 15 seconds
  }));
}
