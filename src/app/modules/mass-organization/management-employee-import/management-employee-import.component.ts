import { APP_CONSTANTS } from '@app/core/app-config';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FileControl } from '@app/core/models/file.control';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { ValidationService } from '@app/shared/services';
import { TranslationService } from 'angular-l10n';
import { ManagementEmployeeService } from '../../../core/services/mass-organization/management-employee.service';
import { AppComponent } from './../../../app.component';
import { CommonUtils } from './../../../shared/services/common-utils.service';

@Component({
  selector: 'management-employee-import',
  templateUrl: './management-employee-import.component.html'
})
export class ManagementEmployeeImportComponent extends BaseComponent implements OnInit {
  public branch: any;
  public formMassMember: FormGroup;
  public dataError: any;
  public ageTypeList: any;
  private formImportConfig = {
    ageType: [1],
    branch: ['', [ValidationService.required]],
  };

  constructor(private managementEmployeeService: ManagementEmployeeService,
    public translation: TranslationService,
    public app: AppComponent,
    private router: Router) {
    super(null);
    const subPaths = this.router.url.split('/');
    if (subPaths.length >= 2) {
      if (subPaths[2] === 'women-member') {
        this.branch = 1;
      }
      if (subPaths[2] === 'youth-member') {
        this.branch = 2;
        this.ageTypeList = APP_CONSTANTS.MASS_MEMBER_AGE_TYPE_LIST;
      }
      if (subPaths[2] === 'union-member') {
        this.branch = 3;
      }
    }
    this.formMassMember = this.buildForm({}, this.formImportConfig);
    this.formMassMember.controls['branch'].setValue(this.branch);
    this.formMassMember.addControl('fileImport', new FileControl(null, ValidationService.required));
  }

  get f() {
    return this.formMassMember.controls;
  }

  ngOnInit() {
  }

  public processDownloadTemplate() {
    this.formMassMember.controls['fileImport'].clearValidators();
    this.formMassMember.controls['fileImport'].updateValueAndValidity();
    if (!CommonUtils.isValidForm(this.formMassMember)) {
      return;
    }
    let params = this.formMassMember.value;
    delete params['fileImport'];
    if (params.ageType == null) {
      params.ageType = 0;
    }
    this.managementEmployeeService.downloadTemplateImport(params).subscribe(res => {
      saveAs(res, 'template_mass_members.xls');
    });
    this.formMassMember.controls['fileImport'].setValidators(ValidationService.required);
  }

  public processImport() {
    if (!CommonUtils.isValidForm(this.formMassMember)) {
      return;
    }
    let params = this.formMassMember.value;
    if (params.ageType == null) {
      params.ageType = 0;
    }
    this.app.confirmMessage(null, () => {// on accepted
      this.managementEmployeeService.processImport(params).subscribe(res => {
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

  public goBack() {
    if (this.branch == 1) {
      this.router.navigate(['/mass/women/employee-management']);
    }
    if (this.branch == 2) {
      this.router.navigate(['/mass/youth/employee-management']);
    }
    if (this.branch == 3) {
      this.router.navigate(['/mass/union/employee-management']);
    }
  }
}