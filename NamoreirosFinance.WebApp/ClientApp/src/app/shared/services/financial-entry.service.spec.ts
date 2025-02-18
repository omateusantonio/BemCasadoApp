import { TestBed } from '@angular/core/testing';

import { FinancialEntryService } from './financial-entry.service';

describe('FinancialEntryService', () => {
  let service: FinancialEntryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FinancialEntryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
