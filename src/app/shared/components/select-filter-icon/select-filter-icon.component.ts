import { environment } from '@env/environment';
import { Dropdown } from 'primeng/dropdown';
import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange, EventEmitter, Output, Pipe, PipeTransform, ViewChildren, AfterViewInit } from '@angular/core';
import { SelectItem, SelectItemGroup } from 'primeng/api';
import { TranslationService } from 'angular-l10n';
import { BaseControl } from '@app/core/models/base.control';
import { CONFIG } from '@app/core';

@Component({
  selector: 'select-filter-icon',
  templateUrl: './select-filter-icon.component.html',
})
export class SelectFilterIconComponent implements OnChanges, OnInit, AfterViewInit {


  @Input()
  public property: BaseControl;
  @Input()
  public isMultiLanguage: boolean;
  @Input()
  public options: any;
  @Input()
  public optionLabel: string;
  @Input()
  public optionValue: string;
  @Input()
  public placeHolder: string;
  @Input()
  public disabled = false;
  @Input()
  public autofocus = '';
  @Input()
  public appendTo = '';
  @Input()
  public filter = true;
  @ViewChildren('dropDown')
  public dropDown;
  // End
  emptyFilterMessage: any;
  selectedValue: any;
  selectedLabel: any;
  checkShowClear = false;
  listData: SelectItem[];
  @Output()
  public onChange: EventEmitter<any> = new EventEmitter<any>();

  public ICON_API_URL = environment.serverUrl['assessment'] + CONFIG.API_PATH['settingIcon'] +   '/icon/';
  constructor(
    public translation: TranslationService
  ) {
    this.listData = [];
    this.emptyFilterMessage = this.translation.translate('selectFilter.emptyFilterMessage');
  }

  ngOnChanges(changes: SimpleChanges) {
    const options: SimpleChange = changes.options;
    const property: SimpleChange = changes.property;
    if (options && options.currentValue) {
      this.initDropdown(options.currentValue);
    }
    this.selectedValue = this.property.value;
    this.selectedLabel = this.getSelectedLabel(this.property.value)
    this.checkShowClear = (this.selectedValue === null || this.selectedValue === '') ? false : true;
    this.validateSeletedValue();
  }

  ngAfterViewInit() {
    // Sửa bug đối với form không phải là popup và lỗi tự động scrolldown khi hiển thị popup
    if (this.dropDown && this.autofocus === 'autofocus') {
      setTimeout(() => {
          this.dropDown.first.focus();
      }, 0);
    }
  }

  ngOnInit() {
    this.property.valueChanges.subscribe(
      (value) => {
        this.selectedValue = value;
        this.selectedLabel = this.getSelectedLabel(value)
        this.checkShowClear = (this.selectedValue === null || this.selectedValue === '') ? false : true;
      }
    );
    // Sửa bug ExpressionChangedAfterItHasBeenCheckedError đối với form popup
    Dropdown.prototype.onInputFocus = function (event) {
      setTimeout(() => {
          this.focused = true;
          this.onFocus.emit(event);
      });
      };
    Dropdown.prototype.onInputBlur = function (event) {
        setTimeout(() => {
          this.focused = false;
          this.onModelTouched();
          this.onBlur.emit(event);
    });
    };
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
    this.checkShowClear = (this.selectedValue === null || this.selectedValue === '') ? false : true;
    this.property.setValue(this.selectedValue);
    this.onChange.emit(this.selectedValue);
  }

  // Validate gia tri combobox co ton tai hay khong
  private validateSeletedValue() {
    if (!this.selectedValue || this.listData.length === 0) {
      return;
    }

    if (this.listData.length > 0) {
      const obj = this.listData.find(x => x.value === this.selectedValue);
      if (!obj) {
        this.checkShowClear = false;
        this.property.setValue(null);
        this.onChange.emit(null);
      }
    }
  }

  /**
   * Get selected label by selected value
   */
  private getSelectedLabel(_selectedValue: any) {
    if (_selectedValue && this.listData.length > 0) {
      const obj = this.listData.find(x => x.value === _selectedValue);
      if (obj) {
        return obj.label
      }
    }
    return ''
  }
}
