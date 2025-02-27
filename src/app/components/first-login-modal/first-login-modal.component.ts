import { Component, inject, model, OnInit } from '@angular/core';
import { Modal, ModalOptions } from 'flowbite';

import { UserStateService } from '../../services/user-state.service';
import { ActivityService } from '../../services/activity.service';
import { ImportDialogComponent } from '../import-dialog/import-dialog.component';

@Component({
  selector: 'app-first-login-modal',
  imports: [ImportDialogComponent],
  templateUrl: './first-login-modal.component.html',
})
export class FirstLoginModalComponent implements OnInit {
  userStateSvc = inject(UserStateService);
  activitySvc = inject(ActivityService);

  modal!: Modal;

  isOpen = model<boolean>(false);

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

  onClose() {
    this.userStateSvc.unmarkFirstLogin();
    this.modal.hide();
  }
}
