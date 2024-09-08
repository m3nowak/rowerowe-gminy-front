import { TestBed } from '@angular/core/testing';

import { ExtAuthService } from './ext-auth.service';

describe('ExtAuthService', () => {
  let service: ExtAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExtAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
