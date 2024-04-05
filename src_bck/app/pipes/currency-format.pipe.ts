import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Pipe({
  name: 'currencyFormat',
  standalone: true
})
export class CurrencyFormatPipe extends CurrencyPipe implements PipeTransform {
  // https://stackoverflow.com/questions/69226753/how-to-overwrite-match-extended-currencypipe-method-type-in-angular
  // typescript compiler issue
  override transform(value: number | string | null | undefined): null;
  override transform(value: string | number | null | undefined): string | null {
    if (undefined === value || null === value) return null;

    return super.transform(value, 'USD', 'symbol', '1.2-2') || '';
  }
}
