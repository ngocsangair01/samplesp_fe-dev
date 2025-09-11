import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, OnChanges, TemplateRef, AfterViewInit } from '@angular/core';
import { Form, FormArray, FormControl } from '@angular/forms';
import { AppComponent } from '@app/app.component';
import { throwIfAlreadyLoaded } from '@app/core/guards/module-import.guard';
import { CommonUtils } from '@app/shared/services';
import { BaseComponent } from '../base-component/base-component.component';

@Component({
  selector: 'table-input',
  templateUrl: './table-input.component.html'
})
export class TableInputComponent extends BaseComponent implements OnInit{

  @Input()
  columnsConfig;

  @Input()
  optionTemplate: TemplateRef<any>;

  @Input()
  formConfig;

  @Input()
  disabledAction = false;

  formArray: FormArray;

  constructor() {
    super();
  }

  ngOnInit() {
    this.formArray = new FormArray([]);
    this.addRow();
  }


  addRow() {
    this.formArray.push(this.buildForm('', this.formConfig));
  }

  deleteRow(index) {
    if (this.formArray.length > 1) {
      this.formArray.removeAt(index);
    }
  }


}
