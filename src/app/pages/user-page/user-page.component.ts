import { Component } from '@angular/core';
import { BtnDirective } from '../../common-components/btn.directive';
import { RouterLink } from '@angular/router';
import { ImportDialogComponent } from '../../components/import-dialog/import-dialog.component';

@Component({
  selector: 'app-user-page',
  imports: [BtnDirective, RouterLink, ImportDialogComponent],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.css',
})
export class UserPageComponent {}
