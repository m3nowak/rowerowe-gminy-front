import { Component, inject, model, OnInit, ViewChild } from '@angular/core';
import { Modal, ModalOptions } from 'flowbite';

import { UserStateService } from '../../services/user-state.service';
import { ActivityService } from '../../services/activity.service';

import { BtnDirective } from '../../common-components/btn.directive';
import { ProcessingStatsComponent } from '../processing-stats/processing-stats.component';
import { UserSettingsComponent } from '../user-settings/user-settings.component';
import { CustomNGXLoggerService } from 'ngx-logger';

@Component({
  selector: 'app-first-login-modal',
  imports: [BtnDirective, ProcessingStatsComponent, UserSettingsComponent],
  templateUrl: './first-login-modal.component.html',
})
export class FirstLoginModalComponent implements OnInit {
  userStateSvc = inject(UserStateService);
  activitySvc = inject(ActivityService);
  logger = inject(CustomNGXLoggerService).getNewInstance({
    partialConfig: { context: 'FirstLoginModalComponent' },
  });

  modal!: Modal;

  @ViewChild(UserSettingsComponent) userSettings!: UserSettingsComponent;

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
        this.logger.debug('modal is hidden');
        this.updateIsOpen();
      },
      onShow: () => {
        this.logger.debug('modal is shown');
        this.updateIsOpen();
      },
      onToggle: () => {
        this.logger.debug('modal has been toggled');
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
    if (this.userSettings) {
      this.userSettings.acceptChanges();
    } else {
      this.logger.debug('UserSettingsComponent is not available');
    }
    this.modal.hide();
  }
}
