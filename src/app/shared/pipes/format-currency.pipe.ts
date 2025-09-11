import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { catchError } from 'rxjs/operators';
const padding = "000000";
@Pipe({
  name: 'formatCurrency'
})
export class FormatCurrencyPipe implements PipeTransform {
  private prefix: string;
  private decimal_separator:string;
  private thousands_separator:string;
  private suffix:string;

  constructor(){
      this.prefix='';
    this.suffix='';
    this.decimal_separator='.';
    this.thousands_separator = ',';
  }
  transform(value: string, fractionSize:number = 0 ): string {
    
    if(parseFloat(value) % 1 != 0)
    {
      fractionSize = 0;
    }
    let [ integer, fraction = ""] = (parseFloat(value).toString() || "").toString().split(".");

    fraction = fractionSize > 0
      ? this.decimal_separator + (fraction+padding).substring(0, fractionSize) : "";
    integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, this.thousands_separator);
    if(isNaN(parseFloat(integer)))
    {
          integer = "";
    }
      return this.prefix + integer + fraction + this.suffix;
    
  }

  parse(value: string, fractionSize: number = 2): string {
    let [ integer, fraction = "" ] = (value || "").replace(this.prefix, "")
                                                  .replace(this.suffix, "")
                                                  .split(this.decimal_separator);

    integer = integer.replace(new RegExp(this.thousands_separator, "g"), "");

    fraction = parseInt(fraction, 10) > 0 && fractionSize > 0
      ? this.decimal_separator + (fraction + padding).substring(0, fractionSize)
      : "";

    return integer + fraction;
  }

}

@Pipe({ name: 'findBy', pure: false })
export class FindByPipe implements PipeTransform {
  transform(items: any[], searchText: string, propsName: string[]): any[] {
    if (!items) { return []; }
    if (!searchText) { return items; }
    if (!propsName) { return items; }
    searchText = searchText.toLowerCase();
    return items.filter( it => {
      for (const propName of propsName) {
        const isMatched = it[propName].toLowerCase().includes(searchText);
        if (isMatched) {
          return true;
        }
      }
    });
   }
}