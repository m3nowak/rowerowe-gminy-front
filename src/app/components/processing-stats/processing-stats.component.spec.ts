import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessingStatsComponent } from './processing-stats.component';

describe('ProcessingStatsComponent', () => {
  let component: ProcessingStatsComponent;
  let fixture: ComponentFixture<ProcessingStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcessingStatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessingStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
