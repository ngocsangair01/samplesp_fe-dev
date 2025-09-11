import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'enumerate',
})
export class EnumeratePipe implements PipeTransform {
  transform(n: number): number[] {
    let arrayNum = []
    for (let i = 0; i < n; i++) {
      arrayNum.push(i);
    }
    return arrayNum.map((_,i) => i);
  }
}
