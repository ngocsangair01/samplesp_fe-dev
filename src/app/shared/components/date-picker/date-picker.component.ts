import { BaseControl } from '@app/core/models/base.control';
import { CommonUtils } from '@app/shared/services';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { Component, OnInit, Input, OnChanges, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { HelperService } from '@app/shared/services/helper.service';

@Component({
  selector: 'date-picker',
  templateUrl: './date-picker.component.html',
})
export class DatePickerComponent implements OnInit, OnChanges {
  public vi: any;
  @Input()
  public property: FormControl;
  @Input()
  public dateFormat: string;
  @Input()
  public onChange: Function;
  @Input()
  public yearRange: string;
  @Input()
  public showIcon = true;
  @Input()
  public disabled = false;
  @Input()
  public appendTo = '';
  @Input()
  public view = 'date';
  @Input()
  public showTime = false;
  @Input()
  public timeOnly = false;
  @Input()
  public minDate = null;
  @Input()
  public maxDate = null;
  @Output()
  public onChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  public action: EventEmitter<any> = new EventEmitter<any>();

  public placeholder: string;
  @Input()
  public dateValue: Date;
  private dateMask: string;
  constructor(
    private helperService: HelperService
  ) {
  }
  private initDefaultYear() {
    const currentYear = new Date().getFullYear();
    this.yearRange = (currentYear - 100) + ':' + (currentYear + 100);
  }

  ngOnInit() {
    if (this.view === 'month') {
      this.placeholder = 'MM/yyyy';
      this.dateFormat = 'mm/yy';
    } else if (this.timeOnly) {
      this.placeholder = 'HH:mm';
      this.dateFormat = 'HH:mm';
    } else if (this.showTime) {
      this.placeholder = 'dd/MM/yyyy HH:mm';
    }
    this.vi = {
      firstDayOfWeek: 0,
      dayNames: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
      dayNamesShort: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
      dayNamesMin: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
      monthNames: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"],
      monthNamesShort: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"],
      today: 'Hôm nay',
      clear: 'Làm mới'
    };
    this.property.valueChanges.subscribe(value => {
      this.ngOnChanges();
    });
  }
  onBlur(event) {
    if (!this.dateValue && event.currentTarget.value !== '') {
      this.helperService.APP_TOAST_MESSAGE.next({ type: 'ERROR', code: 'dateInvalid', message: null });
    }/* else if (this.dateValue && this.dateValue.getTime() < 0) {
      this.helperService.APP_TOAST_MESSAGE.next({type: 'ERROR', code: 'dateInvalid', message: null});
      this.dateValue = null;
      this.onInput(null);
    }*/
    /*const currentYear = new Date().getFullYear();
    if (this.dateValue) {
      if (this.dateValue.getFullYear() < (currentYear - 50) || this.dateValue.getFullYear() > (currentYear + 50)) {
        this.helperService.APP_TOAST_MESSAGE.next({type: 'ERROR', code: 'dateInvalid', message: null});
        this.dateValue = null;
        this.onInput(null);
      }
    }*/

    // Xu ly neu nguoi dung xoa het gia tri ngay thang
    if (event.currentTarget.value === '' && this.dateValue !== null) {
      this.dateValue = null;
      this.onInput(null);

    }
    if (event.currentTarget.value === '' && this.dateValue == null) {
      this.onChanged.emit(event);
    }

  }
  // Check if hours of minutes < 10 concat 0
  getHoursOrMinuterOftimeOnly(number: any) {
    if (number < 10) {
      let hoursTemp = '0';
      number = hoursTemp.concat(number)
    }
    return number
  }
  getDate(date) {
    return ("0" + date.getDate()).slice(-2) + "/" + ("0" + (date.getMonth() + 1)).slice(-2) + '/' + date.getUTCFullYear();
  }
  /**
   * set Value
   */
  setValue(value: number) {
    if (CommonUtils.nvl(value) > 0) {
      this.dateValue = new Date(value);
    } else {
      this.dateValue = null;
    }
    this.onInput(null);
  }
  /**
   * ngOnChanges
   */
  ngOnChanges() {
    if (this.property.value) {
      this.dateValue = new Date(this.property.value);
    } else {
      this.dateValue = null;
    }

    if (!this.yearRange) {
      this.initDefaultYear();
    }

    if (!this.dateFormat) {
      let _dateFormat = CommonUtils.getDateFormat();
      this.placeholder = _dateFormat;
      if (_dateFormat.indexOf('yyyy') >= 0) {
        _dateFormat = _dateFormat.replace('yyyy', 'yy');
      }
      while (_dateFormat && _dateFormat.indexOf('M') >= 0) {
        _dateFormat = _dateFormat.replace('M', 'm');
      }
      this.dateFormat = _dateFormat;
    }
  }
  onSelect(event) {
    if (this.dateValue) {
      this.property.setValue(this.dateValue.getTime());
    } else {
      this.property.setValue(null);
    }
    if (this.onChange) {
      this.onChange();
    }
    this.action.emit('select');
    this.onChanged.emit(event);
  }
  initDateFormatPosition(dateFormat: string) {
    const maxLength = dateFormat.length;
    const iMask = [];
    for (let i = 0; i < dateFormat.length; i++) {
      const char = dateFormat[i];
      if ('/' === char) {
        iMask.push(i - iMask.length > 0 ? (i - iMask.length - 1) : (i - iMask.length));
      }
    }
    const parse = {
      maxLength: maxLength
      , isBackward: (cursorPosition) => {
        const char = dateFormat.substr(cursorPosition, 1);
        return char === '/';
      }, isForward: (i) => {
        return iMask.indexOf(i) >= 0;
      }
    };
    return parse;
  }
  initTimeFormatPosition(dateFormat: string) {
    const maxLength = dateFormat.length;
    const iMask = [];
    for (let i = 0; i < dateFormat.length; i++) {
      const char = dateFormat[i];
      if (':' === char) {
        iMask.push(i - iMask.length > 0 ? (i - iMask.length - 1) : (i - iMask.length));
      }
    }
    const parse = {
      maxLength: maxLength
      , isBackward: (cursorPosition) => {
        const char = dateFormat.substr(cursorPosition, 1);
        return char === ':';
      }, isForward: (i) => {
        return iMask.indexOf(i) >= 0;
      }
    };
    return parse;
  }

  onInput(event): void {
    let parseFormat;
    let strFormat;
    if (this.view === 'month') {
      strFormat = 'MM/yyyy';
      parseFormat = this.initDateFormatPosition('MM/yyyy');
    } else if (this.timeOnly) {
      strFormat = 'HH:mm';
      parseFormat = this.initTimeFormatPosition('HH:mm');
    } else if (this.showTime) {
      strFormat = 'dd/MM/yyyy HH:mm';
      parseFormat = {
        maxLength: strFormat.length
        , isBackward: (cursorPosition) => {
          const char = strFormat.substr(cursorPosition, 1);
          return char === ':';
        }, isForward: (i) => {
          return strFormat.indexOf(i) >= 0;
        }
      }
    } else {
      strFormat = CommonUtils.getDateFormat();
      parseFormat = this.initDateFormatPosition(CommonUtils.getDateFormat());
    }
    if (event) {
      let cursorPosition = event.target.selectionEnd;
      if (event.inputType === 'deleteContentBackward' && parseFormat.isBackward(cursorPosition)) {
        event.target.value = event.target.value.substring(0, cursorPosition - 1) + event.target.value.substring(cursorPosition);
        cursorPosition--;
      }
      if (event.inputType === 'insertText' && (event.target.value.length > parseFormat.maxLength)) {
        event.target.value = event.target.value.substring(0, event.target.value.length - 1);
      }
      if (!this.showTime) {
        this.dateMask = event.target.value.toString();
        this.dateMask = this.dateMask.replace(/\D/g, '');
      } else {
        this.dateMask = event.target.value.toString();
      }

      let mask = '';
      for (let i = 0; i < this.dateMask.length; i++) {
        mask += this.dateMask[i];
        if (parseFormat.isForward(i)) {
          if (this.timeOnly) {
            mask += ':';
          } else if (this.showTime) {
            mask = this.dateMask
          } else {
            mask += '/';
          }
          if (parseFormat.isBackward(cursorPosition)) {
            cursorPosition++;
          }
        }
      }
      event.target.value = mask.toString();
      event.target.selectionStart = cursorPosition;
      event.target.selectionEnd = cursorPosition;
      if (mask.length === 0) {
        this.dateValue = null;
      } else if (mask.length === parseFormat.maxLength) {
        if (this.dateValue) {
          let strDateValue;
          if (this.timeOnly) {
            strDateValue = this.getHoursOrMinuterOftimeOnly(this.dateValue.getHours()) + ':' + this.getHoursOrMinuterOftimeOnly(this.dateValue.getMinutes());
          } else if (this.showTime) {
            strDateValue = this.getDate(this.dateValue) + ' ' + this.getHoursOrMinuterOftimeOnly(this.dateValue.getHours()) + ':' + this.getHoursOrMinuterOftimeOnly(this.dateValue.getMinutes());
          } else {
            strDateValue = moment(this.dateValue).format(strFormat.toUpperCase());
          }
          if (strDateValue !== mask) {
            if (this.timeOnly) {
              this.helperService.APP_TOAST_MESSAGE.next({ type: 'ERROR', code: 'timeInvalid', message: null });
              this.dateValue = null;
              this.onInput(null);
            } else if (this.showTime) {
              this.helperService.APP_TOAST_MESSAGE.next({ type: 'ERROR', code: 'datetimeInvalid', message: null });
              this.dateValue = null;
              this.onInput(null);
            } else {
              this.helperService.APP_TOAST_MESSAGE.next({ type: 'ERROR', code: 'dateInvalid', message: null });
              this.dateValue = null;
              this.onInput(null);
            }
          }
        } else {
          if (this.timeOnly) {
            this.helperService.APP_TOAST_MESSAGE.next({ type: 'ERROR', code: 'timeInvalid', message: null });
            this.dateValue = null;
            event.target.value = null;
            this.onInput(null);
          } else if (this.showTime) {
            this.helperService.APP_TOAST_MESSAGE.next({ type: 'ERROR', code: 'datetimeInvalid', message: null });
            this.dateValue = null;
            event.target.value = null;
            this.onInput(null);
          } else {
            this.helperService.APP_TOAST_MESSAGE.next({ type: 'ERROR', code: 'dateInvalid', message: null });
            this.dateValue = null;
            event.target.value = null;
            this.onInput(null);
          }
        }
      }
      if (event.target.value) {
        this.action.emit('input');
        this.onChanged.emit(event.target.value);
      }
    }
    if (this.dateValue) {
      this.property.setValue(this.dateValue.getTime());
    } else {
      this.property.setValue(null);
    }
    if (this.onChange) {
      this.onChange();
    }
  }

}
