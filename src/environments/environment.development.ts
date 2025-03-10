import { NgxLoggerLevel } from 'ngx-logger';

export const environment = {
  admInfoUrl: '/static/combo.json.gz',
  borderInfoUrl: '/static/topo.json.gz',
  coaBaseUrl: '/static/coa/',
  loggerLevel: NgxLoggerLevel.DEBUG,
  clientId: '133568',
  localBaseUrl: 'http://localhost:4200/',
  apiBaseUrl: 'http://localhost:8000',
  posthogKey: 'phc_ckzJ8Pkw8Aja17asBkb75O42iIGKx50uICW6E9wIEom',
  posthogHost: 'https://eu.i.posthog.com',
  production: false,
};
