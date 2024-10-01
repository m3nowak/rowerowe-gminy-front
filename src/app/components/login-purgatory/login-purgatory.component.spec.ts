import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginPurgatoryComponent } from './login-purgatory.component';

describe('LoginPurgatoryComponent', () => {
  let component: LoginPurgatoryComponent;
  let fixture: ComponentFixture<LoginPurgatoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginPurgatoryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPurgatoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
