import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapLibreComponent } from './map-libre.component';

describe('MapLibreComponent', () => {
  let component: MapLibreComponent;
  let fixture: ComponentFixture<MapLibreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapLibreComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MapLibreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
