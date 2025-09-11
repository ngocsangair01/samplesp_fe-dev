import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { VicinityEmployeePlanService } from '@app/core/services/vicinityPlan/vicinity-employee-plan.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { ValidationService } from '@app/shared/services/validation.service';

@Component({
  selector: 'vicinity-employee-plan-search',
  templateUrl: './vicinity-employee-plan-search.component.html'
})
export class VicinityEmployeePlanSearchComponent extends BaseComponent implements OnInit {

  formConfig = {
    employeeCode: ['', [ValidationService.maxLength(100)]],
    fullName: ['', [ValidationService.maxLength(200)]],
    documentName: ['', [ValidationService.maxLength(200)]],
    organizationId: ['']
  };

  constructor(
    private router: Router,
    private app: AppComponent,
    private vicinityEmployeePlanService: VicinityEmployeePlanService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.employeeManager"));
    this.setMainService(vicinityEmployeePlanService);
    this.formSearch = this.buildForm({}, this.formConfig);
  }

  ngOnInit() {
    this.processSearch();
  }

  get f() {
    return this.formSearch.controls;
  }

  public prepareSaveOrUpdate(item?: any) {
    if (item && item.vicinityPositionPlanId > 0) {
      this.vicinityEmployeePlanService.findOne(item.vicinityPositionPlanId)
        .subscribe(res => {
          if (res.data != null) {
            this.router.navigate(['/employee/vicinity-employee-plan-edit/', item.vicinityPositionPlanId]);
          }
        })
    }
    else {
      this.router.navigate(['/employee/vicinity-employee-plan-add']);
    }
  }

  processDelete(item) {
    if (item && item.vicinityPositionPlanId > 0) {
      this.app.confirmDelete(null, () => {// on accepted
        this.vicinityEmployeePlanService.deleteById(item.vicinityPositionPlanId)
          .subscribe(res => {
            if (this.vicinityEmployeePlanService.requestIsSuccess(res)) {
              this.processSearch(null);
            }
          });
      }, () => {// on rejected

      });
    }
  }

  processExport() {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }

    const formData = Object.assign({}, this.formSearch.value);
    const searchData = CommonUtils.convertData(formData);
    const params = CommonUtils.buildParams(searchData);
    this.vicinityEmployeePlanService.exportListVicinityEmployeePlan(params)
      .subscribe(res => {
        saveAs(res, 'Danh_sach_quy_hoach_can_bo_theo_ca_nhan.xlsx');
      });
  }

  prepareImport() {
    this.router.navigate(['/employee/vicinity-employee-plan-import']);
  }
}
