import { TestBed } from '@angular/core/testing';

import { UserConsentsService } from './user-consents.service';

describe('UserConcentsService', () => {
  let service: UserConsentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserConsentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
