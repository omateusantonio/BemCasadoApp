import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'brazilianCurrencyToFloat',
  standalone: true
})

@Injectable({
  providedIn: 'root'
})
export class BrazilianCurrencyToFloatPipe implements PipeTransform {

  transform(value: string): number {
    if (!value) return 0;
    const isValueString = typeof value === 'string';
    const isValueNumber = typeof value === 'number';

    if (isValueNumber) return value;
    
    if (value && isValueString) {
      const formattedValue = parseFloat(value.replaceAll(".", "").replace(",", "."));
      return formattedValue;
    }

    return 0;
  }

}
