import { Component, OnInit, Input, SimpleChanges, OnChanges, SimpleChange, Output, EventEmitter } from '@angular/core';
import { BaseControl } from '@app/core/models/base.control';
import { HelperService } from '@app/shared/services/helper.service';

@Component({
  selector: 'auto-complete',
  templateUrl: './auto-complete.component.html'
})
export class AutoCompleteComponent implements OnChanges, OnInit {

  // formControl of this input
  @Input()
  public property: BaseControl;

  @Input()
  public options: any;

  @Input()
  public optionLabel: string;

  @Input()
  public optionValue: string;

  @Input()
  public placeholder: any;

  @Input()
  public maxLength: number;

  @Input()
  public appendTo = '';

  @Output() onBlur = new EventEmitter<any>();

  selectedValue: any;

  listData = [];
  filteredList = [];

  constructor(
    private helperService: HelperService
  ) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.listData = this.options;
    this.setSelectedValue();
  }

  search(event) {
    const query = event.query;
    this.filteredList = [];
    for (let i = 0; i < this.listData.length; i++) {
      const obj = this.listData[i];
      if (obj[this.optionLabel].toLowerCase().indexOf(query.toLowerCase()) === 0) {
        this.filteredList.push(obj);
      }
    }
  }

  onSelect() {
    if (this.selectedValue) {
      this.property.setValue(this.selectedValue[this.optionValue]);
    }
  }

  onUnselect() {
  }

  onClear() {
    this.selectedValue = null;
    this.property.setValue(null);
  }

  onBlurMethod(event) {
    setTimeout(() => {
      if (this.validateValid() === true) {
        const value = this.selectedValue[this.optionLabel] || this.selectedValue;
        this.onBlur.emit(value);
      }
    }, 200);
  }

  setSelectedValue() {
    if (this.property && this.property.value && this.listData && this.listData.length > 0) {
      this.selectedValue = this.listData.find(x => x[this.optionValue] === this.property.value);
    }
  }

  validateValid() {
    if (!this.selectedValue) {
      return true;
    }
    const obj = this.listData.findIndex( x => x[this.optionLabel] === this.selectedValue[this.optionLabel]
      || x[this.optionLabel] === this.selectedValue);
    if (obj > -1) {
      this.property.setValue(this.selectedValue[this.optionValue] || this.selectedValue);
      return true;
    } else {
      this.helperService.APP_TOAST_MESSAGE.next({type: 'ERROR', code: 'ERROR.dataInvalidInDataBase', value: this.selectedValue});
      this.onClear();
      return false;
    }
  }
}
