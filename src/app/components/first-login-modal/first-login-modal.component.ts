import { Component, inject, model, OnInit } from '@angular/core';
import { Modal, ModalOptions } from 'flowbite';

import { UserStateService } from '../../services/user-state.service';
import { ActivityService } from '../../services/activity.service';

import { BtnDirective } from '../../common-components/btn.directive';
import { ProcessingStatsComponent } from '../processing-stats/processing-stats.component';
import { UserSettingsComponent } from '../user-settings/user-settings.component';

@Component({
  selector: 'app-first-login-modal',
  imports: [BtnDirective, ProcessingStatsComponent, UserSettingsComponent],
  templateUrl: './first-login-modal.component.html',
})
export class FirstLoginModalComponent implements OnInit {
  userStateSvc = inject(UserStateService);
  activitySvc = inject(ActivityService);

  modal!: Modal;

  isOpen = model<boolean>(false);

  updateIsOpen() {
    this.isOpen.set(!this.modal.isHidden());
  }

  ngOnInit(): void {
    const $targetEl = document.getElementById('first-login-modal');
    const options: ModalOptions = {
      placement: 'center',
      backdrop: 'dynamic',
      backdropClasses: 'bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-40',
      closable: false,

      onHide: () => {
        console.log('modal is hidden');
        this.updateIsOpen();
      },
      onShow: () => {
        console.log('modal is shown');
        this.updateIsOpen();
      },
      onToggle: () => {
        console.log('modal has been toggled');
        this.updateIsOpen();
      },
    };
    this.modal = new Modal($targetEl, options);
    if (this.isOpen()) {
      this.modal.show();
    } else {
      this.modal.hide();
    }
  }

  close() {
    this.userStateSvc.unmarkFirstLogin();
    this.modal.hide();
  }
}
