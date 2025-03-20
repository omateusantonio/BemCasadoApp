import { Injectable } from '@angular/core';
import { IEnumOption } from '../interfaces/enum-option.interface';
import { TransactionType } from '../enums/transaction-type.enum';

@Injectable({
  providedIn: 'root'
})
export class EnumService {

  getTransactionTypes(): IEnumOption[] {
    return [
      {value: TransactionType.Income, label: "Entrada"},
      {value: TransactionType.Expense, label: "Saída"}
    ];
  }

}
