import { Dropdown } from 'primeng/dropdown';
import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange, EventEmitter, Output, Pipe, PipeTransform, ViewChildren, AfterViewInit } from '@angular/core';
import { SelectItem, SelectItemGroup } from 'primeng/api';
import { TranslationService } from 'angular-l10n';
import { BaseControl } from '@app/core/models/base.control';

@Component({
  selector: 'select-filter',
  templateUrl: './select-filter.component.html',
})
export class SelectFilterComponent implements OnChanges, OnInit, AfterViewInit {


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
  public group = false;
  @Input()
  public filter = true;
  @Input()
  public isDisplayClear = true;
  // Start fix request select by nation
  @Input()
  public nationConfigType: string;
  public nationSelected: any;
  public listNation;
  public nationFilter = '';
  @ViewChildren('btnItem')
  public btnItems;
  @ViewChildren('inputSearch')
  public inputSearch;
  @ViewChildren('dropDown')
  public dropDown;
  // End
  emptyFilterMessage: any;
  selectedValue: any;
  checkShowClear = false;
  listData: SelectItem[];
  listDataGroup: SelectItemGroup[];
  @Output()
  public onChange: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    public translation: TranslationService
  ) {
    this.listData = [];
    this.nationSelected = {};
    this.emptyFilterMessage = this.translation.translate('selectFilter.emptyFilterMessage');
  }

  ngOnChanges(changes: SimpleChanges) {
    const options: SimpleChange = changes.options;
    const property: SimpleChange = changes.property;
    if (property && property.currentValue) {
      this.initNationFlag(property.currentValue);
    }
    if (options && options.currentValue) {
      this.initDropdown(options.currentValue);
    }
    this.selectedValue = this.property.value;
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
      if (!this.group) {
        this.listData = [];
        for (const item of data) {
          let label = item[this.optionLabel];
          if (this.isMultiLanguage) {
            label = this.translation.translate(label);
          }
          this.listData.push({label: label, value: item[this.optionValue]});
        }
      } else {
        this.listDataGroup = data;
      }
    }
  }
  selectedChange() {
    this.checkShowClear = (this.selectedValue === null || this.selectedValue === '') ? false : true;
    this.property.setValue(this.selectedValue);
    this.onChange.emit(this.selectedValue);
  }
  // Start fix by nation
  choseNation(nation) {
    if (this.disabled) {
      return;
    }
    this.nationSelected = nation;

  }
  initNationFlag(property) {
    if (! this.nationConfigType) {
      return;
    }
    if (!property || !property.value ) {
      this.nationSelected = {};
      return;
    }
  }
  changeIndex(index) { // tính index của element đang focus
    let currentIndex = -1; // chưa có item nào được focus
    for (let i = 0; i < this.btnItems._results.length; i++) {
      const item = this.btnItems._results[i];
      if (item.nativeElement.classList.contains('focus')) {
        item.nativeElement.classList.remove('focus');
        currentIndex = i;
        break;
      }
    }
    if (currentIndex <= -1) { // không tìm thấy item focus
      this.btnItems.first.nativeElement.focus();
      this.btnItems.first.nativeElement.classList.add('focus');
      this.inputSearch.first.nativeElement.focus();
      return;
    }
    let nextIndex = currentIndex += index;
    nextIndex = (nextIndex <= 0) ? 0 : (nextIndex >= this.btnItems._results.length ? this.btnItems._results.length - 1 : nextIndex);
    this.btnItems._results[nextIndex].nativeElement.classList.add('focus');
  }
  focusElement() { // focus vào element để scroll down up
    for (const item of this.btnItems._results) {
      if (item.nativeElement.className.includes('focus')) {
        item.nativeElement.focus();
        this.inputSearch.first.nativeElement.focus();
        return;
      }
    }
  }
  focusInputSearch() {
    setTimeout(() => {
      this.inputSearch.first.nativeElement.focus();
    }, 400);
  }
  choseFocusNation() {
    // chọn element đang focus
    for (const item of this.btnItems._results) {
      if (item.nativeElement.className.includes('focus')) {
        item.nativeElement.click();
        this.inputSearch.first.nativeElement.focus();
        return;
      }
    }
    // đóng pupop
    for (const item of this.btnItems._results) {
      if (item.nativeElement.className.includes('selected')) {
        item.nativeElement.click();
        return;
      }
    }
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
}
