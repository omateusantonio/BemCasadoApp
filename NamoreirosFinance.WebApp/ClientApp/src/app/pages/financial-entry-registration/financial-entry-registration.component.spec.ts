import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialEntryRegistrationComponent } from './financial-entry-registration.component';

describe('FinancialEntryRegistrationComponent', () => {
  let component: FinancialEntryRegistrationComponent;
  let fixture: ComponentFixture<FinancialEntryRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinancialEntryRegistrationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinancialEntryRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
