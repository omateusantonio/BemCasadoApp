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

    const isValueNumber = typeof value === 'number';

    if (isValueNumber) return value;
    
    const formattedValue = parseFloat(value.replaceAll(".", "").replace(",", ".").trim());

    if (isNaN(formattedValue)) return 0;

    return formattedValue;
  }

}
