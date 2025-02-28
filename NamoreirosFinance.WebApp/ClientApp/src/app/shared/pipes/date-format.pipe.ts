import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat',
  standalone: true
})
@Injectable({
  providedIn: 'root'
})
export class DateFormatPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return '';

    value = value.replace(/\D/g, '');

    if (value.length > 2) {
      const day = value.substring(0, 2);
      if (Number(day) > 31) {
        value = '31' + value.substring(2);
      }
      value = value.substring(0, 2) + '/' + value.substring(2);
    }
    if (value.length > 5) {
      const month = value.substring(3, 5);
      if (Number(month) > 12) {
        value = value.substring(0, 3) + '12' + value.substring(5);
      }
      value = value.substring(0, 5) + '/' + value.substring(5, 9);
    }

    return value;
  }
}