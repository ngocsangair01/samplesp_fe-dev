import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { PoliticsQualityService } from '@app/core/services/security-guard/politics-quality.service';
import { Router } from '@angular/router';
import { ValidationService, CommonUtils } from '@app/shared/services';
import { FileControl } from '@app/core/models/file.control';
import { OrganizationService } from '@app/core';
import { HrStorage } from '@app/core/services/HrStorage';
import * as moment from 'moment';
import { OrgSelectorComponent } from '@app/shared/components/org-selector/org-selector.component';
import { AppComponent } from '@app/app.component';
import { AppParamService } from '@app/core/services/app-param/app-param.service';

@Component({
  selector: 'politics-quality-import',
  templateUrl: './politics-quality-import.component.html',
})
export class PoliticsQualityImportComponent extends BaseComponent implements OnInit {
  formImport: FormGroup;
  organizationName: string;
  workingDate: string;
  dataError: any;
  formConfig = {
    organizationId: ['', [ValidationService.required]],
    evaluationDate: [new Date().getTime(), [ValidationService.required]],
  };
  arrUserEmail: any;
  nameUserEmail: any;
  defaultDomain = HrStorage.getDefaultDomainByCode(CommonUtils.getPermissionCode("action.import")
                                                    ,CommonUtils.getPermissionCode("resource.politicsQuality"));
  @ViewChild('orgSelector') orgSelector: OrgSelectorComponent;
  constructor(
    private politicsQualityService: PoliticsQualityService,
    private router: Router,
    private organizationService: OrganizationService,
    private app: AppComponent,
    private appParamService: AppParamService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.politicsQuality"));
    this.formImport = this.buildForm({}, this.formConfig)
    this.formImport.addControl('fileImport', new FileControl(null, ValidationService.required));

    this.appParamService.appParams("ACTION_WITH_BRANCH_OFFICIALS_DOCUMENTS").subscribe(
      res => {
        let userEmail = HrStorage.getUserToken().userInfo.email;
        let arr = userEmail.split("@");
        this.nameUserEmail = arr[0];
        this.arrUserEmail = res.data[0].parValue;
      }
    );
  }

  ngOnInit() {
    // thuc hien lay ten don vi de hien thi
    this.organizationService.findOne(this.defaultDomain).subscribe(res => {
      const data = res.data;
      if (data) {
        this.organizationName = data.name;
      }
    });
    const date = moment(new Date(this.f['evaluationDate'].value));
    this.workingDate = 'tháng ' + date.format('MM') + ' năm ' + date.format('YYYY');
  }

  get f() {
    return this.formImport.controls;
  }

  processDownloadTemplate() {
    this.formImport.controls['fileImport'].clearValidators();
    this.formImport.controls['fileImport'].updateValueAndValidity();
    if (!CommonUtils.isValidForm(this.formImport)) {
      return;
    }
    if (!this.validateImportBeforeCurrentMonth()) {
      return;
    }
    const params = this.formImport.value;
    delete params['fileImport'];
    this.politicsQualityService.downloadTemplate(this.formImport.value).subscribe(
      res => {
        saveAs(res, 'BM_ChatLuongChinhTri.xls');
      }
    );
    this.formImport.controls['fileImport'].setValidators(ValidationService.required);
  }

  goBack() {
    this.router.navigate(['/security-guard/politics-quality']);
  }

  onChangeOrganization(data) {
    if (data.organizationId && data.organizationId > 0) {
      const currentDate = new Date();
      if (data.expiredDate === null) {
        const effectiveDate = new Date(data.effectiveDate);
        if (effectiveDate > currentDate) {
          this.app.errorMessage('organizationNotEffectYet');
          this.orgSelector.delete();
          this.organizationName = '';
          return;
        }
      } else {
        const expiredDate = new Date(data.expiredDate);
        if (expiredDate < currentDate) {
          this.app.errorMessage('organizationExpired');
          this.orgSelector.delete();
          this.organizationName = '';
          return;
        }
      }
      this.organizationName = data.name;
    }
  }

  onChangeMonth() {
    const date = moment(new Date(this.f['evaluationDate'].value));
    this.workingDate = 'tháng ' + date.format('MM') + ' năm ' + date.format('YYYY');
  }

  processImport() {
    this.formImport.controls['fileImport'].updateValueAndValidity();
    if (!CommonUtils.isValidForm(this.formImport)) {
      return;
    }
    if (!this.validateImportBeforeCurrentMonth()) {
      return;
    }
    this.app.confirmMessage(null, () => {// on accepted
      this.politicsQualityService.processImport(this.formImport.value).subscribe(
        res => {
          if (this.politicsQualityService.requestIsSuccess(res)) {
            this.goBack();
          } else if (res.type === 'ERROR') {
            this.dataError = res.data;
          }
        }
      );
    }, () => {// on reject
    });
  }

  validateImportBeforeCurrentMonth() {
    const currentMonth = moment(new Date()).format('MM');
    const currentyear = moment(new Date()).format('YYYY');
    const evaluationMonth = moment(new Date(this.f['evaluationDate'].value)).format('MM');
    const evaluationYear = moment(new Date(this.f['evaluationDate'].value)).format('YYYY');
    if (evaluationMonth < currentMonth || evaluationYear < currentyear) {
      if (this.nameUserEmail.indexOf(this.arrUserEmail) === -1) {
        this.app.warningMessage('politicsQuality.import.beforeCurrentMonth');
        return false;
      }
    }
    return true;
  }
}
