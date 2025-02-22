import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirstLoginModalComponent } from './first-login-modal.component';

describe('FirstLoginModalComponent', () => {
  let component: FirstLoginModalComponent;
  let fixture: ComponentFixture<FirstLoginModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirstLoginModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirstLoginModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
