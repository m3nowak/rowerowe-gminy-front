import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login-purgatory',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  templateUrl: './login-purgatory.component.html',
  styleUrl: './login-purgatory.component.scss',
})
export class LoginPurgatoryComponent {
  extAuthSvc = inject(AuthService);
}
