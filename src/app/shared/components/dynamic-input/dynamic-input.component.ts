import { INPUT_TYPE } from './../../../core/app-config';
import { BaseControl } from '@app/core/models/base.control';
import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange, Output, EventEmitter, ViewChild } from '@angular/core';
import { TranslationService } from 'angular-l10n';

@Component({
  selector: 'dynamic-input',
  templateUrl: './dynamic-input.component.html'
})
export class DynamicInputComponent implements OnInit, OnChanges {
  // formControl of this input
  @Input()
  public property: BaseControl;
  // ObjectId for multi language input
  @Input()
  public objectId: string;
  // style for label
  @Input()
  public labelClass: string;
  // style for input
  @Input()
  public inputClass: string;
  // title for lable
  @Input()
  public labelValue: string;
  // input auto focus or not
  @Input()
  public autofocus: string;
  // type of input: TEXT, TEXT-AREA, ...
  @Input()
  public type = INPUT_TYPE.TEXT;
  // other type of input: url...
  @Input()
  public othertype: string;
  // input just allow view
  @Input()
  public readonly: string;
  // max length of input
  @Input()
  public maxLength: number;
  // rows number of text-area
  @Input()
  public rows: number;
  // placeHolder
  @Input()
  public placeHolder: string;
  // label used locale or not
  @Input()
  public usedLocaleLabel = true;
  //manh them
  @Input()
  public disabled: boolean;
  //style
  @Input()
  public styleElm: string;

  public styleObject = {};

  @Output() onChange = new EventEmitter<any>();

  @Output() onBlur = new EventEmitter<any>();

  @ViewChild('op') overlayPanel: any;

  // @ViewChild('langInp')
  // public multiLangInputComponent: MultiLangInputComponent;

  public value: string;
  public isLoadMultiLangComponent = false;
  constructor(private translation: TranslationService) {

  }
  ngOnChanges(changes: SimpleChanges) {
    const objectId: SimpleChange = changes.objectId;
    if (objectId) {
      this.objectId = objectId.currentValue;
    }
  }
  ngOnInit() {
    if (!this.type && this.property.type) {
      this.type = this.property.type;
    }
    if (this.property.propertyConfig && this.property.propertyConfig.maxLength) {
      this.maxLength = this.property.propertyConfig.maxLength;
    }
    if (this.labelValue && this.usedLocaleLabel === true) {
      this.labelValue = this.translation.translate(this.labelValue);
    }
    if (this.styleElm) {
      this.styleObject = JSON.parse(this.styleElm);
    }
  }

  onChangeMethod(newValue: string) {
    this.property.setValue(newValue);
    this.property.markAsTouched();
    this.onChange.emit(newValue);
  }

  onClickMultiLang($event) {
    this.overlayPanel.toggle($event);
    if (!this.isLoadMultiLangComponent && this.property.isMultiLanguage) {
      this.isLoadMultiLangComponent = true;
    }
  }

  onBlurMethod(newValue: string) {
    this.onBlur.emit(newValue);
  }
}