import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TosPageComponent } from './tos-page.component';

describe('TosPageComponent', () => {
  let component: TosPageComponent;
  let fixture: ComponentFixture<TosPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TosPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TosPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
