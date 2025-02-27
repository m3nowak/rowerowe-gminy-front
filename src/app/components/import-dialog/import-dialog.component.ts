import { Component, computed, effect, inject, input, output } from '@angular/core';
import { ActivityService } from '../../services/activity.service';
import { UserStateService } from '../../services/user-state.service';
import { DateTime } from 'luxon';
import {
  AbstractControl,
  FormControl,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { combineLatest, lastValueFrom, map } from 'rxjs';
import { injectMutation } from '@tanstack/angular-query-experimental';
import { BtnDirective } from '../../common-components/btn.directive';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  tablerCheck,
  tablerClock,
  tablerCloudDown,
  tablerRotateClockwise,
} from '@ng-icons/tabler-icons';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { AthleteService } from '../../services/athlete.service';
import { ProgressComponent } from '../../common-components/progress/progress.component';

@Component({
  selector: 'app-import-dialog',
  imports: [BtnDirective, ReactiveFormsModule, NgIconComponent, ProgressComponent],
  providers: [provideIcons({ tablerRotateClockwise, tablerCloudDown, tablerClock, tablerCheck })],
  templateUrl: './import-dialog.component.html',
  styleUrl: './import-dialog.component.css',
})
export class ImportDialogComponent {
  includeCloseOption = input(false);
  close = output();

  userStateSvc = inject(UserStateService);
  activitySvc = inject(ActivityService);
  athleteSvc = inject(AthleteService);

  athleteInfo = injectQuery(() => ({
    queryFn: () => lastValueFrom(this.athleteSvc.getCurrentAthlete()),
    queryKey: ['currentAthlete'],
  }));

  eligibleForImport = computed(() => {
    if (this.athleteInfo.isLoading()) {
      return 'loading';
    }
    if (this.athleteInfo.isError()) {
      return 'error';
    }
    if (this.athleteInfo.data()?.backlogSyncEligible) {
      return 'eligible';
    }
    return 'ineligible';
  });

  lastImport = computed(() => this.athleteInfo.data()?.stravaAccountCreatedAt?.toLocal());

  lastImportEffect = effect(() => {
    const li = this.lastImport();
    if (li) {
      this.startDate.setValue(li.toISODate());
    }
  });

  startDate = new FormControl(DateTime.now().toISODate(), [this.dateValidator]);
  startDateErrors = toSignal(
    combineLatest([this.startDate.statusChanges, this.startDate.valueChanges]).pipe(
      map(() => (this.startDate.errors ? Object.values(this.startDate.errors) : [])),
    ),
  );

  triggerBacklogMutation = injectMutation(() => ({
    mutationFn: () => {
      const date = DateTime.fromISO(this.startDate.value!);
      if (!date.isValid) {
        throw new Error('Invalid date');
      }
      return lastValueFrom(this.activitySvc.triggerBacklog(date));
    },
    onSuccess: () => {
      this.userStateSvc.unmarkFirstLogin();
    },
  }));

  onSubmit() {
    if (!this.startDate.valid) {
      return;
    }
    console.log(this.startDate.value);
    this.triggerBacklogMutation.mutate();
  }

  onClose() {
    this.close.emit();
  }

  dateValidator(control: AbstractControl): ValidationErrors | null {
    if (control.value === null || control.value === undefined || control.value === '') {
      return { info: 'Wymagane pole' };
    }
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(control.value)) {
      return { info: 'Nieprawidłowy format daty (YYYY-MM-DD)' };
    }
    try {
      const date = DateTime.fromISO(control.value);
      if (!date.isValid) {
        return { info: 'Nieprawidłowa data' };
      }
      if (date > DateTime.now()) {
        return { info: 'Data nie może być w przyszłości' };
      }
    } catch {
      return { info: 'Nieprawidłowa data' };
    }
    return null;
  }
}
