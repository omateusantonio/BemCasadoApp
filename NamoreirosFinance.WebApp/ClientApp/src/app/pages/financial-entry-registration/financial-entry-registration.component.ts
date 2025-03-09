import { Component, OnInit } from '@angular/core';
import { RegistrationContentBoxComponent } from "../../components/registration-content-box/registration-content-box.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, ViewportScroller } from '@angular/common';
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

export class FinancialEntryRegistrationComponent implements OnInit {
  private selectedCheckboxes: number[] = [];
  private selectedEntryId: number | null = null;
  financialEntryForm: FormGroup;
  entriesList: IFinancialEntry[] = [];
  transactionTypes: IEnumOption[] = [];
  TransactionTypeEnum = TransactionType;
  isEditMode: boolean = false;

  constructor(private formBuilder: FormBuilder, 
    private financialEntryService: FinancialEntryService,
    private enumService: EnumService,
    private dateFormat: DateFormatPipe,
    private brazilianCurrencyToFloat: BrazilianCurrencyToFloatPipe,
    private scroller: ViewportScroller) {

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
    this.financialEntryForm.get("transactionDate")?.valueChanges.subscribe(value => {
      const maskedDate = this.dateFormat.transform(value);
      this.financialEntryForm.get("transactionDate")?.setValue(maskedDate, {emitEvent: false});
    });
  }

  onSubmit(): void {
    if (this.financialEntryForm.valid) {
      const newEntry = this._getValuesFromForm();
      this._createNewEntry(newEntry);
      this.financialEntryForm.reset({type: [TransactionType.Income]});
    }
  }

  onSubmitUpdate(): void {
    if (this.financialEntryForm.valid) {
      const updatedEntry = this._getValuesFromForm();
      this.financialEntryService.updateEntry(updatedEntry)
                                .subscribe(() => {
                                  const entryIndex = this.entriesList.findIndex(entry => entry.id === this.selectedEntryId);
                                  this.entriesList[entryIndex] = updatedEntry;
                                });
      this.financialEntryForm.reset({type: [TransactionType.Income]});
      this.isEditMode = false;
    }
  }
  
  onChangeAllCheckboxes(event: any) {
    const isChecked = event.target.checked;
    this.selectedCheckboxes = isChecked ? this.entriesList.map(entry => entry.id!) : [];
  }

  onCheckboxChange(selectedId: number): any {
    const isEntryAlreadySelected = this.selectedCheckboxes.includes(selectedId);
    const selectedIdPosition = this.selectedCheckboxes.indexOf(selectedId);

    if (isEntryAlreadySelected) return this.selectedCheckboxes.splice(selectedIdPosition, 1);
    this.selectedCheckboxes.push(selectedId);
  }

  onClickUpdate(entry: IFinancialEntry): void {
    if (!this.isEditMode) this.isEditMode = true;
    this.selectedEntryId = entry.id!;
  
    const formattedValue = this._formatFloatToBrazilianCurrency(entry.value);
    const formattedDate = this._formatDateToBrazilianFormat(entry.transactionDate);
  
    const formattedEntry = {
      ...entry,
      value: formattedValue,
      transactionDate: formattedDate
    };
  
    this.financialEntryForm.patchValue(formattedEntry);
    this._scrollToForm();
  }

  onClickCancel(): void {
    this.financialEntryForm.reset({type: [TransactionType.Income]});
    this.isEditMode = !this.isEditMode;
  }

  isSelected(entryId: number): boolean {
    return this.selectedCheckboxes.includes(entryId);
  }

  isEverythingSelected(): boolean {
    return this.selectedCheckboxes.length === this.entriesList.length;
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

    let entry: IFinancialEntry = {
      description: formValue.description,
      value: this.brazilianCurrencyToFloat.transform(formValue.value),
      transactionDate: this._getDateObject(formValue.transactionDate),
      type: parseInt(formValue.type)
    }

    if (this.selectedEntryId) entry.id = this.selectedEntryId;

    return entry;
  }

  private _getDateObject(date: string): Date {
    const dateParts = date.split("/");
    const day = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]) - 1;
    const year = parseInt(dateParts[2]);
    return new Date(year, month, day);
  }

  private _defineEnums(): void {
    this.transactionTypes = this.enumService.getTransactionTypes();
  }

  private _formatFloatToBrazilianCurrency(value: number): string {
    let valueAsString = value.toString();
  
    if (valueAsString.includes(".")) {
      const [integerPart, decimalPart] = valueAsString.split(".");
      const formattedDecimalPart = decimalPart.length === 1 ? `${decimalPart}0` : decimalPart;
  
      valueAsString = `${integerPart},${formattedDecimalPart}`;
      
    } else {
      valueAsString = `${valueAsString},00`;
    }
  
    return valueAsString;
  }
  
  private _formatDateToBrazilianFormat(date: Date): string {
    date = new Date(date);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
  
    return `${day}/${month}/${year}`;
  }

  private _scrollToForm(): void {
    this.scroller.scrollToAnchor("financialEntryFormContainerId");
  }
}
