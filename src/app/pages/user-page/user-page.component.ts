import { Component, inject } from '@angular/core';
import { BtnDirective } from '../../common-components/btn.directive';
import { RouterLink } from '@angular/router';
import { ImportDialogComponent } from '../../components/import-dialog/import-dialog.component';
import { CookiePopupComponent } from '../../components/cookie-popup/cookie-popup.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-page',
  imports: [BtnDirective, RouterLink, ImportDialogComponent, CookiePopupComponent],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.css',
})
export class UserPageComponent {
  authSvc = inject(AuthService);
}
