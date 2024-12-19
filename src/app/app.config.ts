import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { LoggerModule } from 'ngx-logger';
import { environment } from '../environments/environment';
import { ApiModule } from './api/api.module';
import { provideNgIconsConfig } from '@ng-icons/core';
import { provideTanStackQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { authInterceptor } from './utils/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authInterceptor])),
    importProvidersFrom(LoggerModule.forRoot({ level: environment.loggerLevel })),
    importProvidersFrom(ApiModule.forRoot({ rootUrl: environment.apiBaseUrl })),
    provideNgIconsConfig({ size: '100%' }),
    provideTanStackQuery(new QueryClient()),
  ],
};
