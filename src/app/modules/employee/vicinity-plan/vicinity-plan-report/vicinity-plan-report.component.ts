import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
;
import { VicinityPositionPlanService } from './../../../../core/services/vicinityPlan/vicinity-position-plan.service';

@Component({
  selector: 'vicinity-plan-report',
  templateUrl: './vicinity-plan-report.component.html',
})
export class VicinityPlanReportComponent extends BaseComponent implements OnInit {
  formReport: FormGroup;
  formConfig = {
    organizationId: ['', [Validators.required]],
    positionId: ['', [Validators.required]],
  }
  constructor(
    private vicinityPositionPlanService: VicinityPositionPlanService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.employeeManager"));
    this.formReport = this.buildForm({}, this.formConfig);
  }

  ngOnInit() {
  }

  get f() {
    return this.formReport.controls;
  }

  processReport() {
    if (!CommonUtils.isValidForm(this.formReport)) {
      return;
    }
    this.vicinityPositionPlanService.getVicinityPlanReport(this.formReport.value).subscribe(
      res => {
        saveAs(res, 'ctct_bao_cao_quy_hoach_can_bo_theo_chuc_danh.xlsx');
      }
    );
  }
}
