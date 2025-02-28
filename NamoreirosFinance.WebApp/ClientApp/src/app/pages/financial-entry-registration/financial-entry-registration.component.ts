import { Component } from '@angular/core';
import { RegistrationContentBoxComponent } from "../../components/registration-content-box/registration-content-box.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FinancialEntryService } from '../../shared/services/financial-entry.service';
import { IFinancialEntry } from '../../shared/interfaces/financial-entry.interface';
import { IEnumOption } from '../../shared/interfaces/enum-option.interface';
import { TransactionType } from '../../shared/enums/transaction-type.enum';
import { EnumService } from '../../shared/services/enum.service';
import { DateFormatPipe } from '../../shared/pipes/date-format.pipe';
import { BrazilianCurrencyToFloatPipe } from '../../shared/pipes/brazilian-currency-to-float.pipe';

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
  TransactionTypeEnum = TransactionType;

  constructor(private formBuilder: FormBuilder, 
    private financialEntryService: FinancialEntryService,
    private enumService: EnumService,
    private dateFormat: DateFormatPipe,
    private brazilianCurrencyToFloat: BrazilianCurrencyToFloatPipe) {

    const brazilianMonetaryFormat = /^\d+(\,\d{1,2})?$/;

    this.financialEntryForm = this.formBuilder.group({
      description: ["", Validators.required],
      value: ["", [Validators.required, Validators.min(0.01), Validators.pattern(brazilianMonetaryFormat)]],
      transactionDate: ["", Validators.required],
      type: [TransactionType.Income, Validators.required]
    })
  }

  ngOnInit(): void {
    this._defineEnums();
    this._getAllEntries();
    this._setupDateMaskListener();
  }

  private _setupDateMaskListener() {
    this.financialEntryForm.get('transactionDate')?.valueChanges.subscribe(value => {
      const maskedDate = this.dateFormat.transform(value);
      this.financialEntryForm.get('transactionDate')?.setValue(maskedDate, {emitEvent: false});
    });
  }

  onSubmit() {
    if (this.financialEntryForm.valid) {
      const values = this._getValuesFromForm();
      debugger
      this._createNewEntry(values);
      this.financialEntryForm.reset({type: [TransactionType.Income]});
    }
  }

  private _getAllEntries(): void {
    this.financialEntryService.getEntries()
                              .subscribe((response) => this.entriesList = response);
  }

  private _createNewEntry(entry: IFinancialEntry): void {
    this.financialEntryService.addEntry(entry)
                              .subscribe(response => this.entriesList.push(response));
  }

  private _getValuesFromForm(): IFinancialEntry {
    const formValue = this.financialEntryForm.value;

    const newEntry = {
      description: formValue.description,
      value: this.brazilianCurrencyToFloat.transform(formValue.value),
      transactionDate: this._getDateObject(formValue.transactionDate),
      type: formValue.type[0] //convert to number
    }

    return newEntry;
  }

  private _getDateObject(date: string): Date {
    const dateParts = date.split('/');
    const day = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1;
    const year = parseInt(dateParts[2]);
    return new Date(year, month, day);
  }

  private _defineEnums() {
    this.transactionTypes = this.enumService.getTransactionTypes();
  }
  
}
