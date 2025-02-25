import { Component, computed, inject, model, OnInit } from '@angular/core';
import { Modal, ModalOptions } from 'flowbite';
import { BtnDirective } from '../../common-components/btn.directive';
import { AbstractControl, FormControl, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { combineLatest, lastValueFrom, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { DateTime } from 'luxon';
import { tablerRotateClockwise } from '@ng-icons/tabler-icons';
import { UserStateService } from '../../services/user-state.service';
import { injectMutation } from '@tanstack/angular-query-experimental';
import { ActivityService } from '../../services/activity.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';

@Component({
  selector: 'app-first-login-modal',
  imports: [BtnDirective, ReactiveFormsModule, NgIconComponent],
  providers: [provideIcons({ tablerRotateClockwise })],
  templateUrl: './first-login-modal.component.html',
})
export class FirstLoginModalComponent implements OnInit {
  userStateSvc = inject(UserStateService);
  activitySvc = inject(ActivityService);

  modal!: Modal;

  isOpen = model<boolean>(false);

  startHint = computed(() => {
    const hint = this.userStateSvc.firstLoginImportDateHint() ?? DateTime.now();
    return hint.toISODate();
  });

  startDate = new FormControl(this.startHint(), [this.dateValidator]);
  startDateErrors = toSignal(
    combineLatest([this.startDate.statusChanges, this.startDate.valueChanges]).pipe(map(() => (this.startDate.errors ? Object.values(this.startDate.errors) : []))),
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

  ngOnInit(): void {
    const $targetEl = document.getElementById('first-login-modal');
    const options: ModalOptions = {
      placement: 'center',
      backdrop: 'dynamic',
      backdropClasses: 'bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-40',
      closable: false,
      onHide: () => {
        console.log('modal is hidden');
      },
      onShow: () => {
        console.log('modal is shown');
      },
      onToggle: () => {
        console.log('modal has been toggled');
      },
    };
    this.modal = new Modal($targetEl, options);
    if (this.isOpen()) {
      this.modal.show();
    } else {
      this.modal.hide();
    }
  }

  onSubmit() {
    if (!this.startDate.valid) {
      return;
    }
    console.log(this.startDate.value);
    this.triggerBacklogMutation.mutate();
  }

  onClose() {
    this.userStateSvc.unmarkFirstLogin();
    this.modal.hide();
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
