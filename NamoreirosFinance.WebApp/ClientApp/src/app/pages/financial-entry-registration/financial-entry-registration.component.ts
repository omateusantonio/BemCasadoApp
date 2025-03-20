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
import { QueryRequest } from '../../shared/models/query-request';
import { HttpResponse } from '@angular/common/http';
import { PaginationInfo } from '../../shared/models/pagination-info';

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
  protected paginationInfo: PaginationInfo = new PaginationInfo();
  readonly previousPage = -1;
  readonly nextPage = 1;
  readonly paginationOptions: number[] = [5, 10, 25, 50, 100];

  constructor(private formBuilder: FormBuilder, 
    private financialEntryService: FinancialEntryService,
    private enumService: EnumService,
    private dateFormat: DateFormatPipe,
    private brazilianCurrencyToFloat: BrazilianCurrencyToFloatPipe,
    private scroller: ViewportScroller,
    private toast: ToastService) {

    this.financialEntryForm = this._createForm();
  }

  ngOnInit(): void {
    const request = new QueryRequest({take: 10});
    this._defineEnums();
    this._getPaginatedEntries(request);
    this._setupDateMaskListener();
  }

  onSubmit(): void {
    this._handleSaveButtonClick();
  }

  onSubmitUpdate(): void {
    this._handleSaveButtonClick();
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
    this._openConfirmationDialog();
  }

  onConfirmDelete(): void {
    if (this._entryToDeleteId || this._entryToDeleteId === 0) {
      this._deleteEntry(this._entryToDeleteId);
    };
  }
  
  onCancelDelete(): void {
    this._closeConfirmationDialog();
  }

  onClickNextPage(): void {
    const request = new QueryRequest({skip: this.paginationInfo.skip + this.paginationInfo.take});
    this._getPaginatedEntries(request);
    this.paginationInfo.updateCurrentPage(this.paginationInfo.currentPage + 1);
  }

  onClickTableNavigation(direction: number): void {
    this._navigateToPage(direction);
  }

  onSelectPaginationOption(event: Event): void {
    const selectedItem = (event.target as HTMLSelectElement).value;
    this.paginationInfo.updateTake(parseInt(selectedItem));
    this._getPaginatedEntries(new QueryRequest({take: this.paginationInfo.take}));
  }

  isSelected(entryId: number): boolean {
    return this._selectedCheckboxes.includes(entryId);
  }

  isEverythingSelected(): boolean {
    return this._selectedCheckboxes.length === this.entriesList.length;
  }

  getPlaceholderEmptyRows(): number[] {
    const  numberOfEmptyRows = Math.max(0, this.paginationInfo.take - this.entriesList.length);
    return Array(numberOfEmptyRows).fill(0).map((_, index) => index);
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

  private _getPaginatedEntries(request: QueryRequest): void {
    this.financialEntryService.getPaginatedEntries(request)
                              .subscribe({
                                next: response => {
                                  this._setupPaginationInfo(response);
                                  this._setEntriesListData(response.body!);
                                },
                                error: () => {
                                  this.toast.showError("Ocorreu um erro ao buscar as transações.");
                                  this._setEntriesListData();
                                }
                              });
  }

  private _createNewEntry(entry: IFinancialEntry): void {
    this.financialEntryService.addEntry(entry)
                              .subscribe({
                                next: response => {
                                  if (this.entriesList.length < this.paginationInfo.take) this.entriesList.push(response);
                                  if (this.entriesList.length === this.paginationInfo.take) this.paginationInfo.totalItems += 1;
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
                                  this._removeEntryFromList(entryId);
                                  this._closeConfirmationDialog();
                                  this._handlePagePositionAfterDelete();
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

  private _setEntriesListData(entries?: IFinancialEntry[]): void {
    this.entriesList = entries || [];
  }

  private _setupPaginationInfo(response: HttpResponse<IFinancialEntry[]>): void {
    const skip = parseInt(response.headers.get("x-skip")!);
    const take = parseInt(response.headers.get("x-take")!);
    const totalCount = parseInt(response.headers.get("x-total-count")!);

    this.paginationInfo.updatePaginationInfo(skip, take, totalCount);
  }

  private _movePagination(pageOffset: number): void {
    const newSkip = this.paginationInfo.skip + (this.paginationInfo.take * pageOffset);
    const request = new QueryRequest({skip: newSkip, take: this.paginationInfo.take});
    this._getPaginatedEntries(request);
    
    const newPage = this.paginationInfo.currentPage + pageOffset;
    this.paginationInfo.updateCurrentPage(newPage);
  }

  private _removeEntryFromList(entryId: number): void {
    this.entriesList = this.entriesList.filter(entry => entry.id !== entryId);
  }

  private _openConfirmationDialog(): void {
    this.isConfirmationDialogOpen = true;
  }

  private _closeConfirmationDialog(): void {
    this.isConfirmationDialogOpen = false;
    this._entryToDeleteId = null;
  }

  private _handlePagePositionAfterDelete(): void {
    const isTableEmpty = this.entriesList.length === 0;
    const isNotFirstPage = this.paginationInfo.currentPage > 1;
    const shouldNavigateToPreviousPage = isTableEmpty && isNotFirstPage;

    const hasFewerItemThanPageSize = this.entriesList.length < this.paginationInfo.take;

    if (shouldNavigateToPreviousPage) {
      this._navigateToPage(this.previousPage);
    } else if (hasFewerItemThanPageSize) {
      this._reloadCurrentPage();
    }
  }
  private _navigateToPage(pageOffset: number) {
    const hasMoreItems = this.paginationInfo.skip + this.paginationInfo.take < this.paginationInfo.totalItems;
    const hasPreviousPage = this.paginationInfo.skip > 0;

    if (pageOffset === this.previousPage && !hasPreviousPage) return;
    if (pageOffset === this.nextPage && !hasMoreItems) return;

    this._movePagination(pageOffset);
  }

  private _reloadCurrentPage(): void {
    const currentPageSkip = (this.paginationInfo.currentPage - 1) * this.paginationInfo.take;
    const request = new QueryRequest({skip: currentPageSkip});
    this._getPaginatedEntries(request);
  }

  private _handleSaveButtonClick(): void {
    if (this.financialEntryForm.valid) {
      const entry = this._getValuesFromForm();
      this._saveOrUpdateEntry(entry);
      this._resetForm();
    } else {
      this.financialEntryForm.markAllAsTouched();
      this.toast.showWarning("Por favor, preencha todos os campos corretamente.");
    }
  }

  private _saveOrUpdateEntry(entry: IFinancialEntry): void {
    if (this.isEditMode) {
      this._updateEntry(entry);
      this.isEditMode = false;
    }

    this._createNewEntry(entry);
  }
}
