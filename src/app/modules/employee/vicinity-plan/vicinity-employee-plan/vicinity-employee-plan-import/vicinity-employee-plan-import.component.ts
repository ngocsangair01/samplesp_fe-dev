import { Component, OnInit, ViewChildren } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { FileControl } from '@app/core/models/file.control';
import { VicinityEmployeePlanService } from '@app/core/services/vicinityPlan/vicinity-employee-plan.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { OrgSelectorComponent } from '@app/shared/components/org-selector/org-selector.component';
import { CommonUtils, ValidationService } from '@app/shared/services';

@Component({
  selector: 'vicinity-employee-plan-import',
  templateUrl: './vicinity-employee-plan-import.component.html',
})
export class VicinityEmployeePlanImportComponent extends BaseComponent implements OnInit {
  positionGroupList = [];
  formImport: FormGroup;
  dataError: any;
  @ViewChildren('orgSelector')
  public orgSelector;
  
  constructor(
    private app: AppComponent,
    private router: Router,
    private vicinityEmployeePlanService: VicinityEmployeePlanService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.employeeManager"));
    this.formImport = this.buildForm({}, { organizationId: ['', [Validators.required]] });
    this.formImport.addControl('fileImport', new FileControl(null, [Validators.required]));
  }

  ngOnInit() {
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
    this.vicinityEmployeePlanService.downloadTemplate().subscribe(
      res => {
        saveAs(res, 'vicinity-employee-plan_template.xls');
      }
    );
    this.formImport.controls['fileImport'].setValidators(ValidationService.required);
  }

  goBack() {
    this.router.navigate(['/employee/vicinity-employee-plan']);
  }

  processImport() {
    this.formImport.controls['fileImport'].updateValueAndValidity();
    if (!CommonUtils.isValidForm(this.formImport)) {
      return;
    }
    this.app.confirmMessage(null, () => {// on accepted
      this.vicinityEmployeePlanService.processImport(this.formImport.value).subscribe(
        res => {
          if (this.vicinityEmployeePlanService.requestIsSuccess(res)) {
            this.goBack();
          } else {
            this.dataError = res.data;
          }
        }
      );
    }, () => {// on reject
    });
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
}
