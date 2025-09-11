import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonUtils } from '@app/shared/services';
import { AppComponent } from '@app/app.component';
import { TranslationService } from 'angular-l10n';
import { FormArray, FormBuilder, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';

@Component({
  selector: 'multi-input-text',
  templateUrl: './multi-input-text.component.html',
})
export class MultiInputTextComponent implements OnInit, OnChanges {
  @Input()
  property: FormArray;
  @Input()
  maxRecord: number;
  @Output()
  public onTextChange: EventEmitter<any> = new EventEmitter<any>();
  @Input()
  disabled:boolean = null;
  @Input()
  required: boolean = false;
  /**
   * constructor
   */
  constructor(private app: AppComponent
    , private translation: TranslationService
    , private fb: FormBuilder
    ) { }
  /**
   * ngOnChanges
   */
  ngOnChanges() {
  }
  /**
   * ngOnInit
   */
  ngOnInit() {
    // tạo giá trị mặc định cho textAreas
    this.onTextChanged();
  }

  changeValue() {
    this.property.controls.forEach(e => {
      if (e.value !== "") {
        e.setErrors(null);
      } else {
        e.setErrors({'required': true});
      }
    })
  }
  
  /**
   * onTextChanged
   */
  public onTextChanged() {
    if (this.required) {
      this.property.push(new FormControl('', Validators.required));
    } else {
      this.property.push(this.fb.control(''));
    }
  }
  
  /**
   * addItem
   */
  public addItem() {
    if (CommonUtils.isNullOrEmpty(this.maxRecord)) {
      if (this.required) {
        this.property.push(new FormControl('', Validators.required));
      } else {
        this.property.push(this.fb.control(''));
      }
    } else {
      if (this.property.controls.length < this.maxRecord) {
        if (this.required) {
          this.property.push(new FormControl('', Validators.required));
        } else {
          this.property.push(this.fb.control(''));
        }
      }
    }
  } 
  /**
   * removeItem
   */
  public removeItem(index) {
    this.property.removeAt(index);
    if (this.property.value.length === 0) {
      if (this.required) {
        this.property.push(new FormControl('', Validators.required));
      } else {
        this.property.push(this.fb.control(''));
      }
    }
  }
}
