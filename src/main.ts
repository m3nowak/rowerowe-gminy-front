import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import posthog from 'posthog-js';
import { environment } from './environments/environment';

posthog.init(environment.posthogKey, {
  api_host: environment.posthogHost,
  person_profiles: 'identified_only',
  opt_out_capturing_by_default: true,
  capture_pageview: false,
  capture_pageleave: false,
  persistence: 'memory',
  opt_out_persistence_by_default: true,
});

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
