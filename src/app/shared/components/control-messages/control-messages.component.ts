import { Component, Input } from '@angular/core';
import { FormControl, ValidationErrors } from '@angular/forms';
import { TranslationService } from 'angular-l10n';
@Component({
  selector: 'app-control-messages',
  templateUrl: './control-messages.component.html',
})
export class ControlMessagesComponent {
  @Input()
  public control: FormControl;
  @Input()
  public labelName?: string;
// tslint:disable-next-line: max-line-length
  private replaceKeys = ['max', 'min', 'maxlength', 'minlength', 'maxLine', 'maxLengthPerLine', 'maxLengthFirstLine', 'dateNotAffter', 'dateNotAffterFix', 'dateNotBefore', 'duplicateArray', 'beforeCurrentDate', 'required', 'multipleMaxlength'];
// tslint:disable-next-line: max-line-length
  private actualKeys =  ['max', 'min', 'requiredLength', 'requiredLength', 'requiredLine', 'requiredmaxLengthPerLine', 'requiredMaxLengthFirstLine', 'dateNotAffter', 'dateNotAffterFix', 'dateNotBefore', 'duplicateArray', 'beforeCurrentDate', 'required', 'multipleMaxlength'];
  private translateKeys = ['dateNotAffter', 'dateNotAffterFix', 'dateNotBefore', 'duplicateArray', 'beforeCurrentDate', 'required'];

  constructor(public translation: TranslationService) {}

  get errorMessage(): string {
    for (const propertyName in this.control.errors) {
      if (this.control.errors.hasOwnProperty(propertyName) && this.control.touched) {
        const messageText = this.translation.translate(`validate.${propertyName}`);
        const errors = this.control.errors[propertyName];
        return this.buildMessage(messageText, errors);
      }
    }
    return undefined;
  }
  markAsUntouched() {
    this.control.markAsUntouched();
  }
  /**
   * buildMessage
   * @param messageText: string
   * @param errors: ValidationErrors
   */
  buildMessage(messageText: string, errors: ValidationErrors): string {
    for (const i in this.replaceKeys) {
      if (errors && errors.hasOwnProperty(this.actualKeys[i])) {
        let text = errors[this.actualKeys[i]];
        if (this.translateKeys.indexOf(this.actualKeys[i]) !== -1) {
          text = this.translation.translate(text);
        }
        messageText = messageText.replace(new RegExp('\\$\\{' + this.replaceKeys[i] + '\\}', 'g'), text);
      }
    }
    return messageText;
  }
}
