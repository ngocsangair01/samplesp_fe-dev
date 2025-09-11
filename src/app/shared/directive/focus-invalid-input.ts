import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[focusInvalidInput]'
})
// tslint:disable-next-line: directive-class-suffix
export class FocusInvalidInput {
  constructor(private el: ElementRef) {}
  @HostListener('submit')
  onFormSubmit(): void {
    const invalidControl = this.el.nativeElement.querySelector('.form-control.ng-invalid');
    if (invalidControl) {
      this.actionFocus(invalidControl);
    }
  }

  actionFocus(invalidControl: any) {
    if (invalidControl.hasChildNodes()) {
      const invalidControlTemp = invalidControl.querySelector('.form-control.ng-invalid');
      if (invalidControlTemp) {
        this.actionFocus(invalidControlTemp);
      } else {
        invalidControl.focus();
      }
    } else {
      invalidControl.focus();
    }
  }
}
