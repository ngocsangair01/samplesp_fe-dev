import { Component, OnInit } from '@angular/core';
import {FormGroup} from "@angular/forms";
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from "primeng/api";
import {BaseComponent} from "@app/shared/components/base-component/base-component.component";
import {EmailSmsDynamicService} from "@app/core/services/setting/email-sms-dynamic.service";
import {
  PreviewEmailContentShowmoreComponent
} from "@app/modules/settings/email-sms-dynamic/preview-email-content-showmore/preview-email-content-showmore.component";

@Component({
  selector: 'email-sms-dynamic-search-popup',
  templateUrl: './email-sms-dynamic-search-popup.component.html',
  styleUrls: ['./email-sms-dynamic-search-popup.component.css']
})
export class EmailSmsDynamicSearchPopupComponent extends BaseComponent implements OnInit {
  form: FormGroup
  formConfig = {
    params: [],
  }


  constructor(
      public ref: DynamicDialogRef,
      public config: DynamicDialogConfig,
      private emailSmsDynamicService: EmailSmsDynamicService,
      public dialogService: DialogService,
  ) {
    super();
  }
  ngOnInit() {
    this.form = this.buildForm('', this.formConfig);
    const form = {
      notificationType: this.config.data.params['notificationType'],
      recipients: this.config.data.params['recipients'],
      emailSubject: this.config.data.params['emailSubject'],
      emailContent: this.config.data.params['emailContent'],
      smsContent: this.config.data.params['smsContent'],
      contentSetting: Number(this.config.data.params['contentSetting']),
      contentTextSetting: Number(this.config.data.params['contentTextSetting']),
      notificationFormEmail: Number(this.config.data.params['notificationFormEmail']),
      notificationFormSms: Number(this.config.data.params['notificationFormSms']),
      params: this.config.data.params['params'],
      blackList: this.config.data.params['blackList'],
    }
    this.emailSmsDynamicService.searchPopUp(form).subscribe(res => {
      this.resultList = res;
      if (this.config.data) {
        let value = {...this.config.data};
        this.form = this.buildForm(value, this.formConfig);
      }
    });
  }

  goBack(){
    this.ref.close()
  }

  public viewMore(data: string) {
    if(data){
      this.buildFormMoreAchievements(data);
    }else{
      this.buildFormMoreAchievements("Không có dữ liệu để hiển thị")
    }
  }

  public buildFormMoreAchievements(data: string){
    const ref = this.dialogService.open(PreviewEmailContentShowmoreComponent, {
      header: 'XEM CHI TIẾT NỘI DUNG EMAIL',
      width: '50%',
      // height: '300px',
      baseZIndex: 1000,
      contentStyle: {"padding": "0"},
      data: {
        emailContent: data
      }
    });
  }
}
