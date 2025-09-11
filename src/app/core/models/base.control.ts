import { INPUT_TYPE } from './../app-config';
import { SysPropertyDetailBean } from '@app/core';
import { FormControl, ValidatorFn, Validators } from '@angular/forms';
import { ValidationService, CommonUtils } from './../../shared/services';

export class BaseControl extends FormControl {
  public propertyName = '';
  public actionForm = '';
  public resource = '';

  public propertyConfig: SysPropertyDetailBean;
  public listValidation: Array<ValidatorFn>;
  public isHide = false;
  public isRequire = false;
  public dateFormat = CommonUtils.getDateFormat();
  public isMultiLanguage = false;
  public type: INPUT_TYPE; // text, number, text-area
  public configBaseControl(propertyConfig?: any, oldValidator?: any, type?: INPUT_TYPE, ) {
    if (type) {
      this.type = type;
    }
    // Xu ly set mac dinh required neu khong co cau hinh trong database
    if (oldValidator) {
      if (typeof oldValidator === 'function') {
        const val = oldValidator as ValidatorFn;
        if ( val === ValidationService.required) {
          this.isRequire = true;
        }
      } else {
        for (const index in oldValidator) {
          const val = oldValidator[index] as ValidatorFn;
          if ( val === ValidationService.required) {
            this.isRequire = true;
          }
        }
      }
    }
    if (propertyConfig) {
      this.propertyConfig = propertyConfig;
      this.isHide = this.propertyConfig.isHide;
      this.isRequire = this.propertyConfig.isRequire;
      this.isMultiLanguage = this.propertyConfig.isTranslation;
      this.dateFormat = this.propertyConfig.dateFormat ? this.propertyConfig.dateFormat : this.dateFormat;
      this.setType();
    }
    this.listValidation = ValidationService.getValidatorArr(oldValidator, this.propertyConfig);
  }

  public getPropertyConfig(): SysPropertyDetailBean {
    return this.propertyConfig;
  }
  public getListValidation(): Array<ValidatorFn> {
    return this.listValidation;
  }
  private setType(): void {
    if (this.propertyConfig.moneyFormat) {
      this.type = INPUT_TYPE.CURRENCY;
      return;
    }
    if (this.propertyConfig.numberFormat) {
      this.type = INPUT_TYPE.NUMBER;
      return;
    }
    if (this.propertyConfig.dateFormat) {
      this.type = INPUT_TYPE.DATE;
      return;
    }
    // if (this.propertyConfig.maxLength >= 200) {
    //   this.type = INPUT_TYPE.TEXT_AREA;
    //   return;
    // }
    this.type = INPUT_TYPE.TEXT;
  }
}
