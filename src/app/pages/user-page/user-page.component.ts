import { Component, inject, OnInit } from '@angular/core';
import { BtnDirective } from '../../common-components/btn.directive';
import { Router, RouterLink } from '@angular/router';
import { ImportDialogComponent } from '../../components/import-dialog/import-dialog.component';
import { CookiePopupComponent } from '../../components/cookie-popup/cookie-popup.component';
import { AuthService } from '../../services/auth.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { tablerX } from '@ng-icons/tabler-icons';
import { DeleteAccountService } from '../../services/delete-account.service';
import { injectMutation } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { Modal } from 'flowbite';

@Component({
  selector: 'app-user-page',
  imports: [BtnDirective, RouterLink, ImportDialogComponent, CookiePopupComponent, NgIconComponent],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.css',
  providers: [provideIcons({ tablerX })],
})
export class UserPageComponent implements OnInit {
  authSvc = inject(AuthService);
  deleteAccountSvc = inject(DeleteAccountService);
  router = inject(Router);

  modal!: Modal;

  ngOnInit() {
    this.modal = new Modal(document.getElementById('delete-account-modal')!);
  }

  deleteAccountMutation = injectMutation(() => ({
    mutationFn: () => lastValueFrom(this.deleteAccountSvc.deleteAccount()),
    onSuccess: () => {
      this.authSvc.logOut();
      console.log(this.modal);
      this.modal.hide();
      this.router.navigate(['/']);
    },
  }));
}
