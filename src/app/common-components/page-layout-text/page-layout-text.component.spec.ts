import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageLayoutTextComponent } from './page-layout-text.component';

describe('PageLayoutTextComponent', () => {
  let component: PageLayoutTextComponent;
  let fixture: ComponentFixture<PageLayoutTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageLayoutTextComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PageLayoutTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
