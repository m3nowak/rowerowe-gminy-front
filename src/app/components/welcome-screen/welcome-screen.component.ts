import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../services/auth.service';
import { CustomNGXLoggerService } from 'ngx-logger';

@Component({
  selector: 'app-welcome-screen',
  standalone: true,
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './welcome-screen.component.html',
  styleUrl: './welcome-screen.component.scss',
})
export class WelcomeScreenComponent {
  logger = inject(CustomNGXLoggerService).getNewInstance({
    partialConfig: { context: 'WelcomeScreen' },
  });

  stravaAuthSvc = inject(AuthService);

  loginClick() {
    this.logger.info('Login clicked');
    this.stravaAuthSvc.logIn();
  }
}
