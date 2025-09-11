import { ConfirmationService } from 'primeng/api';
import { Component} from '@angular/core';
import { LocaleService, TranslationService, Language } from 'angular-l10n';
import { MessageService } from 'primeng/api';
import { HelperService } from './shared/services/helper.service';
declare global {
  interface Window { TwoFactor: any; }
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [MessageService ]
})
export class AppComponent {
  title = 'political-web-app';
  public blocked = false;
  public waitDisplayLoading: boolean = false;
  acceptLabel: string = 'common.button.yes'; //hiển thị giá trị button accept
  rejectLabel: string = 'common.button.no'; //hiển thị giá trị button reject
  @Language() lang: string;
  constructor(public locale: LocaleService
            , public translation: TranslationService
            , public helperService: HelperService
            , private confirmationService: ConfirmationService
            , private messageService: MessageService
            ) {
    this.helperService.APP_TOAST_MESSAGE.subscribe(data => {
      if (data && (data.value || data.data) && data.type === 'ERROR') {
        this.messageError(data.type, data.code, data.value != null? data.value: data.data);
        return;
      }
      this.processReturnMessage(data);
    });
    if (!this.helperService.APP_CONFIRM_DELETE.getValue()) {
      this.helperService.APP_CONFIRM_DELETE.subscribe(data => {
        if (data && data['accept']) {
          this.confirmDelete(data['messageCode'], data['accept']);
        }
      });
    }
    this.helperService.APP_SHOW_PROCESSING.subscribe(isProcessing => {
      this.isProcessing(isProcessing);
    });
    this.helperService.APP_BLOCK_CRITICAL.subscribe((isWait: boolean) => {
      this.waitDisplayLoading = isWait;
    })
  }
  public selectLanguage(language: string): void {
    this.locale.setCurrentLanguage(language);
  }
  public getConfirmationService(): ConfirmationService {
    return this.confirmationService;
  }

  /**
   * confirmMessage
   */
  confirmMessage(messageCode: string, accept: Function, reject: Function) {
    const message = this.translation.translate(messageCode || 'common.message.confirm.save');
    const header = this.translation.translate('common.message.confirmation');
    return this.confirmationService.confirm({
        message: message,
        header: header,
        icon: 'pi pi-exclamation-triangle',
        accept: accept,
        reject: reject,
        acceptLabel: this.translation.translate(this.acceptLabel), //hiển thị giá trị button accept
        rejectLabel: this.translation.translate(this.rejectLabel) //hiển thị giá trị button reject
    });
  }

  confirmMessageNoCode(message: string, accept: Function, reject: Function) {
    const header = this.translation.translate('common.message.confirmation');
    return this.confirmationService.confirm({
      message: message,
      header: header,
      icon: 'pi pi-exclamation-triangle',
      accept: accept,
      reject: reject,
      acceptLabel: this.translation.translate(this.acceptLabel), //hiển thị giá trị button accept
      rejectLabel: this.translation.translate(this.rejectLabel) //hiển thị giá trị button reject
    });
  }

  /**
   * confirmMessageFromAPI
   */
  confirmMessageFromAPI(message: string, accept: Function, reject: Function) {
    const header = this.translation.translate('common.message.confirmation');
    return this.confirmationService.confirm({
        message: message,
        header: header,
        icon: 'pi pi-exclamation-triangle',
        accept: accept,
        reject: reject,
        acceptLabel: this.translation.translate(this.acceptLabel), //hiển thị giá trị button accept
        rejectLabel: this.translation.translate(this.rejectLabel) //hiển thị giá trị button reject
    });
  }

  /**
   * confirmMessage
   */
  confirmMessageError(messageCode: string, accept: Function, reject: Function, valueError?: any) {
    const message = valueError + ' ' + this.translation.translate(messageCode || 'common.message.confirm.save');
    const header = this.translation.translate('common.message.confirmation');
    return this.confirmationService.confirm({
        message: message,
        header: header,
        icon: 'pi pi-exclamation-triangle',
        accept: accept,
        reject: reject,
        acceptLabel: this.translation.translate(this.acceptLabel), //hiển thị giá trị button accept
        rejectLabel: this.translation.translate(this.rejectLabel) //hiển thị giá trị button reject
    });
  }

  /**
   * confirm
   */
  confirm(messageCode: string, headerCode: string, accept: Function, reject: Function, acceptLabel?: any, rejectLabel?: any) {
    if (!accept) {
      return;
    }
    if (!reject) {
      reject = () => {
        return false;
      };
    }
    const message = this.translation.translate(messageCode || 'common.message.confirm.delete');
    const header = this.translation.translate(headerCode || 'common.message.deleteConfirmation');
    return this.confirmationService.confirm({
        message: message,
        header: header,
        icon: 'pi pi-info-circle',
        accept: accept,
        reject: reject,
        acceptLabel: this.translation.translate(acceptLabel || 'common.button.yes'), //hiển thị giá trị button accept
        rejectLabel: this.translation.translate(rejectLabel || 'common.button.no') //hiển thị giá trị button reject
    });
  }

  /**
   * confirmDelete
   */
  confirmDelete(messageCode: string, accept: Function, reject?: Function) {
    if (!accept) {
      return;
    }
    if (!reject) {
      reject = () => {
        return false;
      };
    }
    const message = this.translation.translate(messageCode || 'common.message.confirm.delete');
    const header = this.translation.translate('common.message.deleteConfirmation');
    return this.confirmationService.confirm({
        message: message,
        header: header,
        icon: 'pi pi-info-circle',
        accept: accept,
        reject: reject,
        acceptLabel: this.translation.translate(this.acceptLabel), //hiển thị giá trị button accept
        rejectLabel: this.translation.translate(this.rejectLabel) //hiển thị giá trị button reject
    });
  }
  /**
   * conirmsendRequest
   */
  confirmSendReqest(messageCode: string, accept: Function, reject?: Function) {
    if (!accept) {
      return;
    }
    if (!reject) {
      reject = () => {
        return false;
      };
    }
    const message = this.translation.translate(messageCode || 'common.message.confirm.sendRequest');
    const header = this.translation.translate('common.message.send');
    return this.confirmationService.confirm({
        message: message,
        header: header,
        icon: 'pi pi-info-circle',
        accept: accept,
        reject: reject,
        acceptLabel: this.translation.translate(this.acceptLabel), //hiển thị giá trị button accept
        rejectLabel: this.translation.translate(this.rejectLabel) //hiển thị giá trị button reject
    });
  }
  /**
   * successMessage
   * param errorType
   * param errorCode
   */
  successMessage(code: string, message?: string) {
    this.toastMessage('SUCCESS', code, message);
  }
  /**
   * errorMessage
   * param errorType
   * param errorCode
   */
  errorMessage(code: string, message?: string , life?: number) {
    this.toastMessage('ERROR', code, '', message, life);
  }
  /**
   * warningMessage
   * param errorType
   * param errorCode
   */
  warningMessage(code: string, message?: string , life?: number) {
    this.toastMessage('WARNING', code, '',  message, life);
  }
  /**
   * toastMessage
   * param severity
   * param errorType
   * param errorCode
   */
  public toastMessage(severity: string, code: string, value: string , message?: string, life?: number) {
    let detail;
    message = severity === 'CONFIRM' ? null : message;
    severity = severity === 'CONFIRM' ? 'WARNING' : severity;
    if (!message) {
      detail = this.translation.translate(`${severity}.${code}`);
    } else {
      detail = this.translation.translate(`${severity}.${code}.${message}`);
      if(!detail || detail === 'No key'){
        detail = message;
      }
    }
    detail = detail.replace(new RegExp('\\$\\{' + 'data' + '\\}', 'g'), value || '');
    detail = detail.replace("<br/>"," ");
    severity = severity === 'WARNING' ? 'WARN' : severity;
    const summary = this.translation.translate(`app.messageSummary`);
    this.messageService.add({severity: severity.toLowerCase(), summary: summary, detail: detail, life: life});
  }
  public message(severity: string, text: string) {
    text = text.replace("<br/>"," ");
    this.messageService.add({severity: severity.toLowerCase(), summary: this.translation.translate(`app.messageSummary`), detail: text});
  }
  public messageError(severity: string, text: string, value: any) {
    const message = this.translation.translate('message.'+text);
    let textDetail = message + ' ' + value;
    textDetail = textDetail.replace("<br/>"," ");
    this.messageService.add({severity: severity.toLowerCase()
                        , summary: this.translation.translate(`app.messageSummary`)
                        , detail: textDetail});
  }
  public messError(severity: string, text: string, valueError?: any) {
    const message = this.translation.translate(text);
    let textDetail = valueError || '' + ' ' + message;
    textDetail = textDetail.replace("<br/>"," ");
    this.messageService.add({severity: severity.toLowerCase()
                        , summary: this.translation.translate(`app.messageSummary`)
                        , detail: textDetail});
  }
  /**
   * process return message
   * param serviceResponse
   */
  public processReturnMessage(serviceResponse: any) {
    if (!serviceResponse) {
      return;
    }
    if (serviceResponse.status === 500 || serviceResponse.status === 0) {
      if(serviceResponse.error){
        this.errorMessage('haveError', serviceResponse.error.message );
      } else {
        this.errorMessage('haveError');
      }
      return;
    }
    if (serviceResponse.code && serviceResponse.code !== 'BIRTHDAY_EMPLOYEE') {
      this.toastMessage(serviceResponse.type, serviceResponse.code, serviceResponse.data, serviceResponse.message);
      return;
    }
  }
  /**
   * request is success
   */
  public requestIsError(): void {
    this.toastMessage('ERROR', 'haveError', null);
  }
  public isProcessing(isProcessing: boolean) {
    if (this.blocked && !isProcessing ) {
      setTimeout(() => {
        this.blocked = isProcessing;
        this.updateViewChange();
      }, 500);
    } else if (!this.blocked && isProcessing ) {
      this.blocked = isProcessing;
      this.updateViewChange();
    }
  }
  private updateViewChange() {
    const progressSpinnerCheck = document.getElementById('progressSpinnerCheck');
    if (progressSpinnerCheck) {
      document.getElementById('progressSpinnerCheck').className = this.blocked || this.waitDisplayLoading ? 'progressing' : '';
    }
  }
}
