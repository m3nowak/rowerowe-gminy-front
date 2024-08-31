import { TestBed } from '@angular/core/testing';

import { BordersService } from './borders.service';

describe('BordersService', () => {
  let service: BordersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BordersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
