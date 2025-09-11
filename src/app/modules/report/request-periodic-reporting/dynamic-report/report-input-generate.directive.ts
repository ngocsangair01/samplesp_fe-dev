import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[inp-generate]',
})
export class ReportInputGenerateDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}