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
import { ConfirmationDialogComponent } from '../../components/confirmation-dialog/confirmation-dialog.component';
import { ToastService } from '../../shared/services/toast.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-financial-entry-registration',
  standalone: true,
  imports: [RegistrationContentBoxComponent, ReactiveFormsModule, CommonModule, ConfirmationDialogComponent],
  templateUrl: './financial-entry-registration.component.html',
  styleUrl: './financial-entry-registration.component.css'
})

export class FinancialEntryRegistrationComponent implements OnInit {
  private _selectedCheckboxes: number[] = [];
  private _selectedEntryId: number | null = null;
  private _entryToDeleteId: number | null = null;
  financialEntryForm: FormGroup;
  entriesList: IFinancialEntry[] = [];
  transactionTypes: IEnumOption[] = [];
  protected TransactionTypeEnum = TransactionType;
  isEditMode: boolean = false;
  isConfirmationDialogOpen: boolean = false;
  confirmationDialogMessage: string = "";
  showSuccessAlert: boolean = false;
  emptyObjects: {}[] = [];

  constructor(private formBuilder: FormBuilder, 
    private financialEntryService: FinancialEntryService,
    private enumService: EnumService,
    private dateFormat: DateFormatPipe,
    private brazilianCurrencyToFloat: BrazilianCurrencyToFloatPipe,
    private scroller: ViewportScroller,
    private toast: ToastService) {

    this.financialEntryForm = this._createForm();
  }

  async ngOnInit(): Promise<void> {
    this._defineEnums();
    await this._getAllEntries();
    this._setupDateMaskListener();
  }

  onSubmit(): void {
    if (this.financialEntryForm.valid) {
      const newEntry = this._getValuesFromForm();
      this._createNewEntry(newEntry);
      this._resetForm();
    } else {
      this.financialEntryForm.markAllAsTouched();
      this.toast.showWarning("Por favor, preencha todos os campos corretamente.");
    }
  }

  onSubmitUpdate(): void { // TODO: refactor this abomination of function
    if (this.financialEntryForm.valid) {
      const updatedEntry = this._getValuesFromForm();
      this._updateEntry(updatedEntry);
      this._resetForm();
      this.isEditMode = false;
    } else {
      this.financialEntryForm.markAllAsTouched();
      this.toast.showWarning("Por favor, preencha todos os campos corretamente.");
    }
  }
  
  onChangeAllCheckboxes(event: any) {
    const isChecked = event.target.checked;
    this._selectedCheckboxes = isChecked ? this.entriesList.map(entry => entry.id!) : [];
  }

  onCheckboxChange(selectedId: number): void {
    const isEntryAlreadySelected = this._selectedCheckboxes.includes(selectedId);
    const selectedIdPosition = this._selectedCheckboxes.indexOf(selectedId);

    if (isEntryAlreadySelected) {
      this._selectedCheckboxes.splice(selectedIdPosition, 1);
      return;
    }
    this._selectedCheckboxes.push(selectedId);
  }

  onClickUpdate(entry: IFinancialEntry): void {
    if (!this.isEditMode) this.isEditMode = true;
    this._selectedEntryId = entry.id!;
  
    const formattedEntry = this._formatEntryForForm(entry);
  
    this.financialEntryForm.patchValue(formattedEntry);
    this._scrollToForm();
  }

  onClickCancel(): void {
    this.financialEntryForm.reset({type: [TransactionType.Income]});
    this.isEditMode = !this.isEditMode;
  }

  onClickDelete(entry: IFinancialEntry): void {
    this._entryToDeleteId = entry.id!;
    this.confirmationDialogMessage = `Tem certeza de que deseja excluir a transação "${entry.description}"?`;
    this.isConfirmationDialogOpen = true;
  }

  onConfirmDelete(): void {
    if (this._entryToDeleteId || this._entryToDeleteId === 0) {
      this._deleteEntry(this._entryToDeleteId);
    };
  }
  
  onCancelDelete(): void {
    this.isConfirmationDialogOpen = false;
    this._entryToDeleteId = null;
  }

  isSelected(entryId: number): boolean {
    return this._selectedCheckboxes.includes(entryId);
  }

  isEverythingSelected(): boolean {
    return this._selectedCheckboxes.length === this.entriesList.length;
  }

  private _createForm(): FormGroup {
    const brazilianMonetaryFormat = /^\d+(\,\d{1,2})?$/;
    
    return this.formBuilder.group({
      description: ["", Validators.required],
      value: ["", [Validators.required, Validators.min(0.01), Validators.pattern(brazilianMonetaryFormat)]],
      transactionDate: ["", Validators.required],
      type: [TransactionType.Income, Validators.required]
    });
  }

  private _resetForm(): void {
    this.financialEntryForm.reset({type: TransactionType.Income});
  }

  private _setupDateMaskListener() {
    this.financialEntryForm.get("transactionDate")?.valueChanges.subscribe(value => {
      const maskedDate = this.dateFormat.transform(value);
      this.financialEntryForm.get("transactionDate")?.setValue(maskedDate, {emitEvent: false});
    });
  }

  private _formatEntryForForm(entry: IFinancialEntry): any {
    return {
      ...entry,
      value: this._formatFloatToBrazilianCurrency(entry.value),
      transactionDate: this._formatDateToBrazilianFormat(entry.transactionDate)
    };
  }

  private async _getAllEntries(): Promise<void> {
    try {
      this.entriesList = await firstValueFrom(this.financialEntryService.getEntries());
    } catch (error) {
      this.toast.showError("Ocorreu um erro ao buscar as transações.");
      this.entriesList = [];
    }
  }

  private _createNewEntry(entry: IFinancialEntry): void {
    this.financialEntryService.addEntry(entry)
                              .subscribe({
                                next: response => {
                                  if (this.entriesList.length < 10) this.entriesList.push(response);
                                },
                                error: () => this.toast.showError("Ocorreu um erro ao criar a nova transação."),
                                complete: () => this.toast.showSuccess("Transação criada com sucesso!")
                              });
  }

  private _updateEntry(updatedEntry: IFinancialEntry): void {
    this.financialEntryService.updateEntry(updatedEntry)
                              .subscribe({
                                next: () => {
                                  const entryIndex = this.entriesList.findIndex(entry => entry.id === this._selectedEntryId);
                                  this.entriesList[entryIndex] = updatedEntry;
                                  this._selectedEntryId = null;
                                },
                                error: () => this.toast.showError("Ocorreu um erro ao atualizar a transação selecionada."),
                                complete: () => this.toast.showSuccess("Transação atualizada com sucesso!")
                              });
  }

  private _deleteEntry(entryId: number): void {
    this.financialEntryService.deleteEntry(this._entryToDeleteId!)
                              .subscribe({
                                next: () => {
                                  this.entriesList = this.entriesList.filter(entry => entry.id !== entryId);
                                  this.isConfirmationDialogOpen = false;
                                  this._entryToDeleteId = null;
                                  if (this.entriesList.length < 10) this._getAllEntries();
                                },
                                error: () => this.toast.showError("Ocorreu um erro ao excluir a transação selecionada."),
                                complete: () => this.toast.showSuccess("Transação excluída com sucesso!")
                              });
  }

  private _getValuesFromForm(): IFinancialEntry {
    const formValue = this.financialEntryForm.value;

    let entry: IFinancialEntry = {
      description: formValue.description,
      value: this.brazilianCurrencyToFloat.transform(formValue.value),
      transactionDate: this._getDateObject(formValue.transactionDate),
      type: parseInt(formValue.type)
    }

    if (this._selectedEntryId) entry.id = this._selectedEntryId;

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

  getPlaceholderEmptyRows(maxRows: number = 10): number[] {
    const  numberOfEmptyRows = Math.max(0, maxRows - this.entriesList.length);
    return Array(numberOfEmptyRows).fill(0).map((_, index) => index);
  }
}
