import { Component, inject, input, output } from '@angular/core';
import { BtnDirective } from '../../common-components/btn.directive';
import { RouterLink } from '@angular/router';
import { UserConsentsService } from '../../services/user-consents.service';
import { AlertComponent } from '../../common-components/alert/alert.component';

@Component({
  selector: 'app-cookie-popup',
  imports: [BtnDirective, RouterLink, AlertComponent],
  templateUrl: './cookie-popup.component.html',
  styleUrl: './cookie-popup.component.css',
})
export class CookiePopupComponent {
  userConcentsSvc = inject(UserConsentsService);

  userLoggedIn = input.required<boolean>();
  displayCurrentConsents = input.required<boolean>();
  selectionMade = output();

  rejectSelected() {
    this.userConcentsSvc.consentLevel.set('rejected');
    this.selectionMade.emit();
  }

  requiredSelected() {
    this.userConcentsSvc.consentLevel.set('required');
    this.selectionMade.emit();
  }

  trackingSelected() {
    this.userConcentsSvc.consentLevel.set('tracking');
    this.selectionMade.emit();
  }
}
