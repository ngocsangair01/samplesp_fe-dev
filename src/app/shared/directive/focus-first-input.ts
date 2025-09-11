import {Component, NgModule, Directive, ElementRef, Renderer2} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
@Directive({
  selector: '[focusFirstInput]'
})
// tslint:disable-next-line: directive-class-suffix
export class FocusFirstInput {
  constructor(private el: ElementRef) {}
  ngAfterViewInit() {
  }
}
