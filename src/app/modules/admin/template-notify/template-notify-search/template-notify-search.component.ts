import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, APP_CONSTANTS } from '@app/core/app-config';
import { TemplateNotifyService } from '@app/core/services/admin/template-notify.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { ValidationService } from '@app/shared/services/validation.service';
// import { HrStorage } from '../../../../core/services/HrStorage';

@Component({
  selector: 'template-notify-search',
  templateUrl: './template-notify-search.component.html',
})
export class TemplateNotifySearchComponent extends BaseComponent implements OnInit {
  typeList: any;
  arrUserEmail: any;
  nameUserEmail: any;
  confidentialityList: any;
  branchList: any;
  documentTypeList: any;
  formConfig = {
    code: ['', [Validators.maxLength(100)]],
    name: ['', [Validators.maxLength(200)]],
    smsContent: [''],
  };

  constructor(
    private templateNotifyService: TemplateNotifyService,
    private router: Router,
    private app: AppComponent,
  ) {
    super(null, CommonUtils.getPermissionCode("resource.document"));
    this.setMainService(templateNotifyService);
    this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW);
    this.processSearch();
  }

  ngOnInit() {
  }

  get f() {
    return this.formSearch.controls;
  }

  public prepareSaveOrUpdate(item?: any) {
    if (item && item.templateNotifyId > 0) {
      this.router.navigate(['/admin/template-notify/edit/', item.templateNotifyId]);
    } else {
      this.router.navigate(['/admin/template-notify/add']);
    }
  }

  public prepareView(item) {
    this.router.navigate(['/admin/template-notify/view/', item.templateNotifyId, 'view']);
  }

  processDelete(item) {
    if (item && item.templateNotifyId > 0) {
      this.app.confirmDelete(null, () => {// on accepted
        this.templateNotifyService.deleteById(item.templateNotifyId)
          .subscribe(res => {
            if (this.templateNotifyService.requestIsSuccess(res)) {
              this.processSearch(null);
            }
          });
      }, () => {// on rejected

      });
    }
  }
}