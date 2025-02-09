import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ProgressComponent } from '../../common-components/progress/progress.component';

@Component({
    selector: 'app-login-purgatory',
    imports: [ProgressComponent],
    templateUrl: './login-purgatory.component.html',
    styleUrl: './login-purgatory.component.scss'
})
export class LoginPurgatoryComponent {
  extAuthSvc = inject(AuthService);
}
