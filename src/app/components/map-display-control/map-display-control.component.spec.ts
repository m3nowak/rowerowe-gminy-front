import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapDisplayControlComponent } from './map-display-control.component';

describe('MapDisplayControlComponent', () => {
  let component: MapDisplayControlComponent;
  let fixture: ComponentFixture<MapDisplayControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapDisplayControlComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MapDisplayControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
