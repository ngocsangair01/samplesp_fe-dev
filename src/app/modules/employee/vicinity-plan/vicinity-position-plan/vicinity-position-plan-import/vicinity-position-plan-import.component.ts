import { Component, OnInit, ViewChildren } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { FileControl } from '@app/core/models/file.control';
import { HrStorage } from '@app/core/services/HrStorage';
import { VicinityPositionPlanService } from '@app/core/services/vicinityPlan/vicinity-position-plan.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { OrgSelectorComponent } from '@app/shared/components/org-selector/org-selector.component';
import { CommonUtils, ValidationService } from '@app/shared/services';

@Component({
  selector: 'vicinity-position-plan-import',
  templateUrl: './vicinity-position-plan-import.component.html',
})
export class VicinityPositionPlanImportComponent extends BaseComponent implements OnInit {
  formImport: FormGroup;
  dataError: any;
  formConfig = {
    organizationId: ['', [Validators.required]]
  };
  @ViewChildren('orgSelector')
  public orgSelector;
  private operationKey = 'action.import';
  private adResourceKey = 'resource.employeeManager';
  constructor(
    private app: AppComponent,
    private router: Router,
    private vicinityPositionPlanService: VicinityPositionPlanService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.employeeManager"));
    this.formImport = this.buildForm({}, this.formConfig);
    this.formImport.addControl('fileImport', new FileControl(null, [Validators.required]));
  }

  ngOnInit() {
    const defaultDomain = HrStorage.getDefaultDomainByCode(CommonUtils.getPermissionCode(this.operationKey)
      , CommonUtils.getPermissionCode(this.adResourceKey));
    this.onChangeOrg({ organizationId: defaultDomain });
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
    const params = this.formImport.value;
    delete params['fileImport'];
    this.vicinityPositionPlanService.downloadTemplate(this.formImport.value).subscribe(
      res => {
        saveAs(res, 'vicinity-position-plan_template.xls');
      }
    );
    this.formImport.controls['fileImport'].setValidators(ValidationService.required);
  }

  public onChangeOrg(data) {
    if (data.organizationId && data.organizationId > 0) {
      const currentDate = new Date();
      if (data.expiredDate === null) {
        const effectiveDate = new Date(data.effectiveDate);
        if (effectiveDate > currentDate) {
          this.app.errorMessage('massmember.massOrganizationNotEffectYet');
          return (this.orgSelector.first as OrgSelectorComponent).delete();
        }
      } else {
        const expiredDate = new Date(data.expiredDate);
        if (expiredDate < currentDate) {
          this.app.errorMessage('massmember.massOrganizationExpired');
          return (this.orgSelector.first as OrgSelectorComponent).delete();
        }
      }
    }
  }

  goBack() {
    this.router.navigate(['/employee/vicinity-position-plan']);
  }

  processImport() {
    this.formImport.controls['fileImport'].updateValueAndValidity();
    if (!CommonUtils.isValidForm(this.formImport)) {
      return;
    }
    this.app.confirmMessage(null, () => {// on accepted
      this.vicinityPositionPlanService.processImport(this.formImport.value).subscribe(
        res => {
          if (this.vicinityPositionPlanService.requestIsSuccess(res)) {
            this.goBack();
          } else {
            this.dataError = res.data;
          }
        }
      );
    }, () => {// on reject
    });
  }
}
