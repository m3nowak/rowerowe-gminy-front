import { TestBed } from '@angular/core/testing';

import { GeoFeatureDataService } from './geo-feature-data.service';

describe('GeoFeatureDataService', () => {
  let service: GeoFeatureDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeoFeatureDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
