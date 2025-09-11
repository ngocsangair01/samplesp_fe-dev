import { Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { BaseControl } from '@app/core/models/base.control';
import { SysPropertyDetailBean } from './../../core/models/sys-property-details.model';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  /**
   * validate required with no space
   * NDTCHAN
   */
  public static required(control: AbstractControl): any {
    if (control.value === null || control.value == '') {
      return { required: true };
    } else if (('' + control.value).trim() === '') {
      return { required: true };
    } else {
      return null;
    }
  }

  public static maxLength(length: number): ValidatorFn {
    return (c: AbstractControl): any | null => {
      if (c.value) {
        if ((c.value + '').replace(/\n/g, '\r\n').length > length) {
          return { 'maxlength': { 'requiredLength': length } };
        }
      }
      return null;
    };
  }

  public static maxLine(line: number): ValidatorFn {
    return (c: AbstractControl): any | null => {
      if (c.value) {
        if ((c.value + '').split("\n").length > line) {
          return { 'maxLine': { 'requiredLine': line } };
        }
      }
      return null;
    };
  }

  /**
   * validate giới hạn ký tự mỗi dòng text-area
   * @param maxLengthPerLine 
   * @param maxLengthFirstLine 
   */
  public static maxLengthPerLine(maxLengthPerLine: number, maxLengthFirstLine?: number): ValidatorFn {
    return (c: AbstractControl): any | null => {
      if (c.value) {
        if (c.value.indexOf("\n") != -1) {
          let splitedString = (c.value + '').split("\n");
          let i = 0;
          if (maxLengthFirstLine && maxLengthFirstLine > 0) {
            i = 1;
            if (splitedString[0].length > maxLengthFirstLine) {
              return { 'maxLengthFirstLine': { 'requiredMaxLengthFirstLine': maxLengthFirstLine } };
            }
          }
          for (i; i < splitedString.length; i++) {
            if (splitedString[i].length > maxLengthPerLine) {
              return { 'maxLengthPerLine': { 'requiredmaxLengthPerLine': maxLengthPerLine } };
            }
          }
        }
      }
      return null;
    };
  }

  public static passwordValidator(control: AbstractControl): any {
    if (!control.value) { return; }

    // {6,100}           - Assert password is between 6 and 100 characters
    // (?=.*[0-9])       - Assert a string has at least one number
    // (?!.*\s)          - Spaces are not allowed
    return (control.value.match(/^(?=.*\d)(?=.*[a-zA-Z!@#$%^&*])(?!.*\s).{6,100}$/)) ? '' : { invalidPassword: true };
  }

  /**
   * validate onlyLetterNumber
   */
  public static onlyLetterNumber(control: AbstractControl): any {
    if (!control.value) { return; }
    return (control.value.match(/^[0-9a-zA-Z]+$/)) ? '' : { onlyLetterNumber: true };
  }

  /**
   * validate onlyLetterNumber
   */
  public static notSelectedThisParty(): any {
    return { youMustSelectPartyCell: true };
  }

  public static onlyLetterNumberSpecial(control: AbstractControl): any {
    if (!control.value) { return; }
    return (control.value.match(/^[0-9a-zA-Z_-]+$/)) ? '' : { onlyLetterNumber: true };
  }



  /**
   * validate onlyLetterNumberSp
   */
  public static onlyLetterNumberSp(control: AbstractControl): any {
    if (!control.value) { return; }
    return (control.value.match(/^[0-9a-zA-Z\ ]+$/)) ? '' : { onlyLetterNumber: true };
  }

  /**
   * validate database tableColumnName
   */
  public static dbTableColumnName(control: AbstractControl): any {
    if (!control.value) { return; }
    return (control.value.match(/^[0-9a-zA-Z_]+$/)) ? '' : { dbTableColumnName: true };
  }

  /**
   * validate personalIdNumber
   */
  public static personalIdNumber(control: AbstractControl): any {
    if (!control.value) { return; }
    return (control.value.match(/^[0-9a-zA-Z]{8,15}$/)) ? '' : { personalIdNumber: true };
  }

  /**
   * validate phone
   */
  public static phone(control: AbstractControl): any {
    if (!control.value) { return; }
    return (control.value.match(/^([\+])?(\d([.\s])?){1,15}$/)) ? '' : { phone: true };
  }

  /**
   * validate mobileNumber
   */
  public static mobileNumber(control: AbstractControl): any {
    if (!control.value) { return; }
    return (control.value.match(/^([+][0-9]{1,3}([ .-])?)?([(][0-9]{1,6}[)])?([0-9 .-]{1,32})(([A-Za-z :]{1,11})?[0-9]{1,4}?)$/))
      ? '' : { mobileNumber: true };
  }

  /**
   * validate integer
   */
  public static integer(control: AbstractControl): any {
    if (!control.value) { return; }
    return (control.value.toString().match(/^[\-\+]?\d+$/)) ? '' : { integer: true };
  }

  /**
   * validate positiveInteger
   */
  public static positiveInteger(control: AbstractControl): any {
    if (!control.value) { return; }
    return (control.value.toString().match(/^\d+$/)) ? '' : { positiveInteger: true };
  }

  /**
   * validate number
   */
  public static number(control: AbstractControl): any {
    if (!control.value) { return; }
    return (control.value.toString().match(/^[\-\+]?(([0-9]+)([\.]([0-9]+))?|([\.]([0-9]+))?)$/))
      ? '' : { number: true };
  }

  /**
   * validate positiveNumber
   */
  public static positiveNumber(control: AbstractControl): any {
    if (!control.value) { return; }
    return (control.value.toString().match(/^(([0-9]+)([\.]([0-9]+))?|([\.]([0-9]+))?)$/))
      ? '' : { positiveNumber: true };
  }

  /**
   * validate beforeCurrentDate
   */
  public static beforeCurrentDate(control: AbstractControl): any {
    if (!control.value) { return; }
    const x = new Date().getTime();
    return (control.value < x)
      ? '' : { beforeCurrentDate: true };
  }
  public static afterCurrentDate(control: AbstractControl): any {
    if (!control.value) { return; }
    const x = new Date().getTime();
    return (control.value >= x || x - control.value < 99999999)
      ? '' : { afterCurrentDate: true };
  }

  public static afterAbsCurrentDate(control: AbstractControl): any {
    if (!control.value) { return; }
    const x = new Date().getTime();
    return (control.value >= x)
      ? '' : { afterAbsCurrentDate: true };
  }

  /**
   * Validate IP
   * @param control : any
   */
  public static isIp(control: AbstractControl): any {
    if (!control.value) { return; }
    const str: string = '^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.'
      + '){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$';
    const regExp = new RegExp(str);
    if (!regExp.test(control.value)) {
      return { isIp: true };
    }
    return '';
  }

  /**
   * Validate URL
   * @param control : any
   */
  public static isUrl(control: AbstractControl): any {
    if (!control.value) { return; }
    const str = '(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|' +
      'www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|' +
      'https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})';
    const regExp = new RegExp(str);
    if (!regExp.test(control.value)) {
      return { isUrl: true };
    }
    return '';
  }

  /** Validate email format */
  public static emailFormat(control: AbstractControl): any {
    if (!control.value) { return; }
    // tslint:disable-next-line: max-line-length
    return (control.value.match(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i))
      ? '' : { invalidEmail: true };
  }

  /**
   * Validate date not affter date
   * @param targetKey: any
   * @param toMatchKey: any
   */
  public static notAffter(targetKey: string, toMatchKey: string, labelMatchCode: string): ValidatorFn {
    return (group: FormGroup): { [key: string]: any } => {
      const target = group.controls[targetKey];
      const toMatch = group.controls[toMatchKey];
      if (target.hasError('dateNotAffter')) {
        target.setErrors(null);
        target.markAsUntouched();
      }

      if (target.value && toMatch.value) {
        const isCheck = target.value <= toMatch.value;
        // set equal value error on dirty controls
        if (!isCheck && target.valid && toMatch.valid) {
          target.setErrors({ dateNotAffter: { dateNotAffter: labelMatchCode } });
          target.markAsTouched();
        }
      }
      return null;
    };
  }

  public static notAffterFix(targetKey: string, toMatchKey: string, labelMatchCode: string): ValidatorFn {
    return (group: FormGroup): { [key: string]: any } => {
      const target = group.controls[targetKey];
      const toMatch = group.controls[toMatchKey];
      if (target.hasError('dateNotAffterFix')) {
        target.setErrors(null);
        target.markAsUntouched();
      }

      if (target.value && toMatch.value) {
        const isCheck = target.value <= toMatch.value;
        // set equal value error on dirty controls
        if (!isCheck && target.valid && toMatch.valid) {
          target.setErrors({ dateNotAffterFix: { dateNotAffterFix: labelMatchCode } });
          target.markAsTouched();
        }
      }
      return null;
    };
  }

  /**
   * Validate date not before date
   * @param targetKey: any
   * @param toMatchKey: any
   */
  public static notBefore(targetKey: string, toMatchKey: string, labelMatchCode: string): ValidatorFn {
    return (group: FormGroup): { [key: string]: any } => {
      const target = group.controls[targetKey];
      const toMatch = group.controls[toMatchKey];
      if (target.hasError('dateNotBefore')) {
        target.setErrors(null);
        target.markAsUntouched();
      }

      if (target.value && toMatch.value) {
        const isCheck = target.value >= toMatch.value;
        // set equal value error on dirty controls
        if (!isCheck && target.valid && toMatch.valid) {
          target.setErrors({ dateNotBefore: { dateNotBefore: labelMatchCode } });
          target.markAsTouched();
        }
      }
      return null;
    };
  }

  /**
   * Validate date not affter number
   * @param targetKey: any
   * @param toMatchKey: any
   */
  public static notAffterNumber(targetKey: string, toMatchKey: string, labelMatchCode: string): ValidatorFn {
    return (group: FormGroup): { [key: string]: any } => {
      const target = group.controls[targetKey];
      const toMatch = group.controls[toMatchKey];
      // neu mot trong hai truong null thi chuyen sang require
      if (!target || !toMatch) {
        return null;
      }
      // dieu kien kiem tra
      if (target.hasError('dateNotAffter')) {
        target.setErrors(null);
        target.markAsUntouched();
      }
      const targetValue = parseFloat(target.value);
      const toMatchValue = parseFloat(toMatch.value);
      if (targetValue && toMatchValue) {
        const isCheck = targetValue <= toMatchValue;
        // set equal value error on dirty controls
        if (!isCheck && target.valid && toMatch.valid) {
          target.setErrors({ dateNotAffter: { dateNotAffter: labelMatchCode } });
          target.markAsTouched();
        }
      }
      return null;
    };
  }

  /**
   * Validate date in range 6 Month
   * @param targetKey: any
   * @param toMatchKey: any
   */
  public static isRangeOf6Month(targetKey: string, toMatchKey: string, labelMatchCode: string): ValidatorFn {
    return (group: FormGroup): { [key: string]: any } => {
      const target = group.controls[targetKey];
      const toMatch = group.controls[toMatchKey];
      // kiem tra null
      if (target.hasError('isRangeOf6Month')) {
        target.setErrors(null);
        target.markAsUntouched();
      }

      let temp = new Date(target.value);
      temp.setMonth(temp.getMonth() + 6);

      // kiem tra  gia tri
      if (target.value && toMatch.value) {
        const isCheck = temp >= new Date(toMatch.value);
        // set equal value error on dirty controls
        if (!isCheck) {
          target.setErrors({ isRangeOf6Month: { dateNotAffter: labelMatchCode } });
          target.markAsTouched();
        }
      }
      return null;
    };
  }

  /**
   * Validate date not before a specify date
   * @param targetKey: any
   * @param specifyDate: any
   */
  public static beforeSpecifyDate(targetKey: string, specifyDate: string, labelMatchCode: string): ValidatorFn {
    return (group: FormGroup): { [key: string]: any } => {
      const target = group.controls[targetKey];

      // Neu mot trong hai truong null
      if (!target || !specifyDate) {
        return null;
      }

      // Dieu kien kiem tra
      if (target.hasError('dateNotBefore')) {
        target.setErrors(null);
        target.markAsUntouched();
      }
      const targetValue = parseFloat(target.value);
      const toMatchValue = parseFloat(specifyDate);
      if (targetValue || targetValue === 0 && toMatchValue) {
        const isCheck = targetValue >= toMatchValue;
        // Set equal value error on dirty controls
        if (!isCheck && target.valid) {
          target.setErrors({ dateNotBefore: { dateNotBefore: labelMatchCode } });
          target.markAsTouched();
        }
      }
      return null;
    };
  }

  /**
   * Validate date not after a specify date
   * @param targetKey: any
   * @param specifyDate: any
   */
  public static afterSpecifyDate(targetKey: string, specifyDate: string, labelMatchCode: string): ValidatorFn {
    return (group: FormGroup): { [key: string]: any } => {
      const target = group.controls[targetKey];

      // Neu mot trong hai truong null
      if (!target || !specifyDate) {
        return null;
      }

      // Dieu kien kiem tra
      if (target.hasError('dateNotAffter')) {
        target.setErrors(null);
        target.markAsUntouched();
      }
      const targetValue = parseFloat(target.value);
      const toMatchValue = parseFloat(specifyDate);
      if (targetValue || targetValue === 0 && toMatchValue) {
        const isCheck = targetValue <= toMatchValue;
        // Set equal value error on dirty controls
        if (!isCheck && target.valid) {
          target.setErrors({ dateNotAffter: { dateNotAffter: labelMatchCode } });
          target.markAsTouched();
        }
      }
      return null;
    };
  }

  /**
   * Validate date not before number
   * @param targetKey: any
   * @param toMatchKey: any
   */
  public static notBeforeNumber(targetKey: string, toMatchKey: string, labelMatchCode: string): ValidatorFn {
    return (group: FormGroup): { [key: string]: any } => {
      const target = group.controls[targetKey];
      const toMatch = group.controls[toMatchKey];
      // neu mot trong hai truong null thi chuyen sang require
      if (!target || !toMatch) {
        return null;
      }
      // dieu kien kiem tra
      if (target.hasError('dateNotBefore')) {
        target.setErrors(null);
        target.markAsUntouched();
      }
      const targetValue = parseFloat(target.value);
      const toMatchValue = parseFloat(toMatch.value);
      if (targetValue || targetValue === 0 && toMatchValue) {
        const isCheck = targetValue >= toMatchValue;
        // set equal value error on dirty controls
        if (!isCheck && target.valid && toMatch.valid) {
          target.setErrors({ dateNotBefore: { dateNotBefore: labelMatchCode } });
          target.markAsTouched();
        }
      }
      return null;
    };
  }

  public static getValidatorArr(oldArr: Array<ValidatorFn>, prop?: SysPropertyDetailBean): Array<ValidatorFn> {
    const validators = new Array<ValidatorFn>();
    if (oldArr && oldArr.length > 0 && (prop === null || prop === undefined)) {
      return oldArr;
    }
    if (prop === null || prop === undefined || prop.isHide === true) {
      return validators;
    }
    if (prop.isRequire) {
      validators.push(ValidationService.required);
    }
    if (prop.isEmail) {
      validators.push(Validators.email);
    }
    if (prop.isNumber) {
      validators.push(ValidationService.number);
    }
    if (prop.isUrl) {
      validators.push(ValidationService.isUrl);
    }
    if (prop.isIp) {
      validators.push(ValidationService.isIp);
    }
    if (prop.minLength) {
      validators.push(Validators.minLength(prop.minLength));
    }
    if (prop.maxLength) {
      validators.push(ValidationService.maxLength(prop.maxLength));
    }
    if (prop.numberMin) {
      validators.push(Validators.min(prop.numberMin));
    }
    if (prop.numberMax) {
      validators.push(Validators.max(prop.numberMax));
    }
    if (prop.password) {
      validators.push(ValidationService.passwordValidator);
    }
    if (prop.phone) {
      validators.push(ValidationService.phone);
    }
    if (prop.mobileNumber) {
      validators.push(ValidationService.mobileNumber);
    }
    if (prop.personalIdNumber) {
      validators.push(ValidationService.personalIdNumber);
    }
    if (prop.beforeCurrentDate) {
      validators.push(ValidationService.beforeCurrentDate);
    }
    if (prop.numberType) {
      switch (prop.numberType) {
        case 'isNumber':
          validators.push(ValidationService.number);
          break;
        case 'positiveNumber':
          validators.push(ValidationService.positiveNumber);
          break;
        case 'integer':
          validators.push(ValidationService.integer);
          break;
        case 'positiveInteger':
          validators.push(ValidationService.positiveInteger);
          break;
      }
    }
    if (prop.emailFormat) {
      validators.push(ValidationService.emailFormat);
    }
    return validators;
  }

  /**
   * Validate 'Đơn vị, Chức danh công việc không được phép trùng'
   * @param targetKey: any
   * @param toMatchKey: any
   */
  public static duplicateArray(controlKeys: Array<string>, target: string, messageKey?: string): ValidatorFn {
    return (array: FormArray) => {
      // target.setErrors({duplicateArray: {duplicateName: messageKey}});
      // target.markAsTouched();
      const map: object = {};
      for (const group of array.controls) {
        const controlTaget = group.get(target) as FormControl;
        let count = 0;
        const values = [];
        for (const key of controlKeys) {
          const control = group.get(key) as FormControl;
          if (control.value !== null && control.value !== '') {
            values.push(control.value);
            count++;
          }
        }
        let k = '/' + values.join('/') + '/';
        k = k.toLowerCase();
        if (controlKeys.length === count) {
          if (map.hasOwnProperty(k)) {
            controlTaget.setErrors({ duplicateArray: { duplicateArray: messageKey } });
            controlTaget.markAsTouched();
          } else {
            map[k] = true;
            // fix bug khi xoa row dau khi bi duplicate
            if (controlTaget.hasError('duplicateArray')) {
              controlTaget.setErrors(null);
              controlTaget.markAsUntouched();
            }
          }
        }
      }
      return null;
    };
  }

  // Hàm xử lý validate bắt buộc nhập các trường còn lại nếu có 1 trường trong danh sách được nhập
  public static requiredIfHaveOne(control: AbstractControl): any {
    let isRequire = false;
    const group = control.parent as FormGroup;
    Object.keys(group.controls).forEach(key => {
      const controlEl = group.get(key) as BaseControl;
      if (controlEl.propertyName !== (control as BaseControl).propertyName) {
        if (controlEl.listValidation) {
          for (const f of controlEl.listValidation) {
            const fn = f as ValidatorFn;
            if (fn === ValidationService.requiredIfHaveOne && controlEl.value) {
              isRequire = true;
            }
          }
        }
      }
    });
    if (isRequire && !control.value) {
      return { requiredIfHaveOne: true };
    }
    return null;
  }

  /**
   * Xu ly neu nhu co gia tri tai truong hien tai thi validate bat buoc nhap tai truong duoc set
   * @param controlKeys Ten truong bat buoc nhap
   */
  public static ifHaveOneIsRequired(controlKeys: string): ValidatorFn {
    return (c: AbstractControl): any | null => {
      const group = c.parent as FormGroup;
      if (group) {
        const controlRequired = group.get(controlKeys) as FormControl;
        if (c.value !== null && c.value.toString().length > 0) { //  vi co th value = []
          if (controlRequired.value === null || controlRequired.value === '') {
            controlRequired.setErrors({ ifHaveOneIsRequired: true });
            controlRequired.markAsTouched();
          } else {
            if (controlRequired.hasError('ifHaveOneIsRequired')) {
              controlRequired.setErrors(null);
              controlRequired.markAsUntouched();
            }
          }
        } else {
          if (controlRequired.hasError('ifHaveOneIsRequired')) {
            controlRequired.setErrors(null);
            controlRequired.markAsUntouched();
          }
        }
      }
    };
  }

  /**
   * Xu ly bat buoc nhap truong hien tai khi truong truyen vao co gia tri
   * @param controlKeys Ten truong nhap gia tri
   */
  public static isRequiredIfHaveOne(controlKeys: string): ValidatorFn {
    return (c: AbstractControl): any | null => {
      const group = c.parent as FormGroup;
      const controlHaveOne = group.get(controlKeys) as FormControl;
      if (c.value === null || c.value === '') {
        if (controlHaveOne && (controlHaveOne.value === null || controlHaveOne.value.toString().length === 0)) { //  vi co th value = []
          return null;
        } else {
          return { ifHaveOneIsRequired: true };
        }
      } else {
        return null;
      }
    };
  }

  /**
   * validate array form requird
   * Neu ko nhap truong nao thi ko validate, khi nhap 1 trong cac truong duoc cau hinh thi bat buoc nhap tat ca cac truong cau hinh
   */
  public static requiredControlInGroup(controlKeys: Array<string>, controlKeysIgnore?: Array<string>): ValidatorFn {
    return (group: FormGroup): { [key: string]: any } => {
      let checkExitsValue = false;
      controlKeys.forEach(key => {
        if (controlKeysIgnore && controlKeysIgnore.includes(key)) {
          return true;
        }
        const controlEl = group.get(key) as BaseControl;
        if (controlEl.value !== null && controlEl.value !== '' && controlEl.value) {
          checkExitsValue = true;
        }
      });
      controlKeys.forEach(key => {
        const formControl = group.controls[key];
        if (checkExitsValue) {
          if (formControl.value === null || formControl.value === '') {
            formControl.setErrors({ requiredControlInGroup: true });
            // formControl.markAsTouched();
          } else if (('' + formControl.value).trim() === '') {
            formControl.setErrors({ requiredControlInGroup: true });
            // formControl.markAsTouched();
          } else {
            if (formControl.hasError('requiredControlInGroup')) {
              formControl.setErrors(null);
              formControl.markAsUntouched();
            }
          }
        } else {
          if (formControl.hasError('requiredControlInGroup')) {
            formControl.setErrors(null);
            formControl.markAsUntouched();
          }
        }
      });

      return null;
    };
  }

  /**
   * validate array form requird
   * Neu ko nhap truong nao thi validate, khi nhap 1 trong cac truong duoc cau hinh thi bo validate
   */
  public static requiredIfHaveNone(controlKeys: Array<string>): ValidatorFn {
    return (group: FormGroup): { [key: string]: any } => {
      let checkExitsValue = false;
      controlKeys.forEach(key => {
        const controlEl = group.get(key) as BaseControl;
        if (controlEl && controlEl.value) {
          checkExitsValue = true;
        }
      });

      controlKeys.forEach(key => {
        const formControl = group.controls[key];
        if (!checkExitsValue) {
          formControl.setErrors({ requiredIfHaveNone: true });
        } else {
          if (formControl.hasError('requiredIfHaveNone')) {
            formControl.setErrors(null);
            formControl.markAsUntouched();
          }
        }
      });

      return null;
    };
  }

}