import { Component } from '@angular/core';
import { RegistrationContentBoxComponent } from "../../components/registration-content-box/registration-content-box.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FinancialEntryService } from '../../shared/services/financial-entry.service';
import { IFinancialEntry } from '../../shared/interfaces/financial-entry.interface';
import { IEnumOption } from '../../shared/interfaces/enum-option.interface';
import { TransactionType } from '../../shared/enums/transaction-type.enum';
import { EnumService } from '../../shared/services/enum.service';

@Component({
  selector: 'app-financial-entry-registration',
  standalone: true,
  imports: [RegistrationContentBoxComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './financial-entry-registration.component.html',
  styleUrl: './financial-entry-registration.component.css'
})

export class FinancialEntryRegistrationComponent {
  financialEntryForm: FormGroup;
  entriesList: IFinancialEntry[] = [];
  transactionTypes: IEnumOption[] = [];

  constructor(private formBuilder: FormBuilder, 
    private financialEntryService: FinancialEntryService,
    private enumService: EnumService) {
    this.financialEntryForm = this.formBuilder.group({
      description: ["", Validators.required],
      value: ["", [Validators.required, Validators.min(0.01), Validators.pattern(/^\d+(\,\d{1,2})?$/)]],
      transactionDate: ["", Validators.required],
      type: [TransactionType.Income, Validators.required]
    })
  }

  ngOnInit(): void {
    this._defineEnums();
    this._getAllEntries();
  }

  onSubmit() {
    if (this.financialEntryForm.valid) {
      const values: IFinancialEntry = this._getValuesFromForm();
      
    }
  }

  private _getAllEntries(): void {
    this.financialEntryService.getEntries()
                              .subscribe((response) => this.entriesList = response);
  }

  private _createNewEntry(entry: IFinancialEntry): void {
    this.financialEntryService.addEntry(entry);
  }

  private _getValuesFromForm(): IFinancialEntry {
    const formValue = this.financialEntryForm.getRawValue();

    const newEntry: IFinancialEntry = {
      description: formValue.description,
      value: formValue.value,
      transactionDate: new Date(), //formValue.transactionDate,
      type: formValue.type
    }

    return newEntry;
  }
  
  private _defineEnums() {
    this.transactionTypes = this.enumService.getTransactionTypes();
  }
  
}
