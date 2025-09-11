import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { VicinityPositionPlanService } from '@app/core/services/vicinityPlan/vicinity-position-plan.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { ValidationService } from '@app/shared/services/validation.service';

@Component({
  selector: 'vicinity-position-plan-search',
  templateUrl: './vicinity-position-plan-search.component.html'
})
export class VicinityPositionPlanSearchComponent extends BaseComponent implements OnInit {

  formConfig = {
    documentName: ['', [ValidationService.maxLength(200)]],
    organizationId: [''],
    positionId: ['']
  };

  constructor(
    private router: Router,
    private app: AppComponent,
    private vicinityPositionPlanService: VicinityPositionPlanService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.employeeManager"));
    this.setMainService(vicinityPositionPlanService);
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
      this.vicinityPositionPlanService.findOne(item.vicinityPositionPlanId)
        .subscribe(res => {
          if (res.data != null) {
            this.router.navigate(['/employee/vicinity-position-plan-edit/', item.vicinityPositionPlanId]);
          }
        });
    }
    else {
      this.router.navigate(['/employee/vicinity-position-plan-add']);
    }
  }

  processDelete(item) {
    if (item && item.vicinityPositionPlanId > 0) {
      this.app.confirmDelete(null, () => {// on accepted
        this.vicinityPositionPlanService.deleteById(item.vicinityPositionPlanId)
          .subscribe(res => {
            if (this.vicinityPositionPlanService.requestIsSuccess(res)) {
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
    this.vicinityPositionPlanService.exportListVicinityPositionPlan(params)
      .subscribe(res => {
        saveAs(res, 'Danh_sach_quy_hoach_can_bo_theo_chuc_danh.xlsx');
      });
  }

  prepareImport() {
    this.router.navigate(['/employee/vicinity-position-plan-import']);
  }
}
