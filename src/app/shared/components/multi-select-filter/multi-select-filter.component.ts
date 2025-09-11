import { FormControl } from '@angular/forms';
import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange, EventEmitter, Output, AfterViewChecked } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { TranslationService } from 'angular-l10n';


@Component({
  selector: 'multi-select-filter',
  templateUrl: './multi-select-filter.component.html',
})
export class MultiSelectFilterComponent implements OnChanges, OnInit, AfterViewChecked {


  @Input()
  public property: FormControl;
  @Input()
  public isMultiLanguage: boolean;
  @Input()
  public options: any;
  @Input()
  public optionLabel: string;
  @Input()
  public optionValue: string;
  @Input()
  public filterPlaceHolder: string;
  @Input()
  public disabled = false;
  @Input()
  public autoFocus = false;
  @Input()
  public appendTo = '';
  @Input()
  public maxSelectedLabels = '10';
 @Input()
 public showVertical = false;

  selectedValue: any;
  listData: SelectItem[];
  @Output()
  public onChange: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    public translation: TranslationService
  ) {
    this.listData = [];
  }

  ngOnChanges(changes: SimpleChanges) {
    const options: SimpleChange = changes.options;
    const property: SimpleChange = changes.property;
    if (options && options.currentValue) {
      this.initDropdown(options.currentValue);
    }
    this.selectedValue = this.property.value;

  }
  ngAfterViewChecked() {
  }
  ngOnInit() {
  }

  initDropdown(data?: any) {
    if (data) {
      this.listData = [];
      for (const item of data) {
        let label = item[this.optionLabel];
        if (this.isMultiLanguage) {
          label = this.translation.translate(label);
        }
        this.listData.push({label: label, value: item[this.optionValue]});
      }
    }
  }
  selectedChange() {
    this.property.setValue(this.selectedValue);
    this.onChange.emit(this.selectedValue);
  }

  findLabelByValue(value): string {
    if (!this.listData) {
      return '';
    }
    for (const item of this.listData) {
      if (item.value === value) {
        return item.label;
      }
    }
    return '';
  }

}
