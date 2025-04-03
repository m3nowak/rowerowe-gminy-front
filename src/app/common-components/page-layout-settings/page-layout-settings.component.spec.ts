import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageLayoutSettingsComponent } from './page-layout-settings.component';

describe('PageLayoutSettingsComponent', () => {
  let component: PageLayoutSettingsComponent;
  let fixture: ComponentFixture<PageLayoutSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageLayoutSettingsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PageLayoutSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
