import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { FileControl } from '@app/core/models/file.control';
import { ReceiveNotificationGroupService } from '@app/core/services/setting/recieve-notification-group.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { TranslationService } from 'angular-l10n';

@Component({
  selector: 'receive-notification-group-import',
  templateUrl: './receive-notification-group-import.component.html',
  styleUrls: ['./receive-notification-group-import.component.css']
})
export class ReceiveNotificationGroupImportComponent extends BaseComponent implements OnInit {

  public formImport: FormGroup;
  public dataError: any;
  private formImportConfig = {
    name: ['', Validators.compose([Validators.required, Validators.maxLength(200)])]
  };

  constructor(public translation: TranslationService,
    private app: AppComponent,
    private router: Router,
    private receiveNotificationGroupService: ReceiveNotificationGroupService) {
    super(null, CommonUtils.getPermissionCode("resource.receiveNotificationGroup"));
    this.formImport = this.buildForm({}, this.formImportConfig);
    this.formImport.addControl('fileImport', new FileControl(null, ValidationService.required));
  }

  ngOnInit() {
  }

  get f() {
    return this.formImport.controls;
  }

  /**
   * processImport
   */
  processImport() {
    this.formImport.controls['fileImport'].updateValueAndValidity();
    if (!CommonUtils.isValidForm(this.formImport)) {
      return;
    }
    this.app.confirmMessage(null, () => {// on accepted
      this.receiveNotificationGroupService.processImport(this.formImport.value).subscribe(res => {
        if (res.type !== 'SUCCESS') {
          this.dataError = res.data;
        } else {
          this.dataError = null;
          this.goBack();
        }
      });
    }, () => {
      // on rejected
    });
  }

  /**
   * processDownloadTemplate
   */
  processDownloadTemplate() {
    this.formImport.controls['fileImport'].clearValidators();
    this.formImport.controls['fileImport'].updateValueAndValidity();
    const params = this.formImport.value;
    delete params['fileImport'];
    this.receiveNotificationGroupService.downloadTemplateImport(params).subscribe(res => {
      saveAs(res, 'receive_notification_group_template.xls');
    });
    this.formImport.controls['fileImport'].setValidators(ValidationService.required);
  }

  public goBack() {
    this.router.navigate(['/settings/receive-notification-group']);
  }
}
