import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
;
import { EmployeeAssessmentReportService } from './../../../../core/services/employee/employee-assessment-report.service';

@Component({
  selector: 'employee-assessment-report',
  templateUrl: './employee-assessment-report.component.html',
  styleUrls: ['./employee-assessment-report.component.css']
})
export class EmployeeAssessmentReportComponent extends BaseComponent implements OnInit {
  formReport: FormGroup;
  periodList = [];
  isMobileScreen: boolean = false;
  formConfig = {
    organizationId: ['', [Validators.required]],
    periodAccessId: ['', [Validators.required]],
    validFrom: [''],
    validTo: ['']
  };

  constructor(
    private employeeAssessmentReportService: EmployeeAssessmentReportService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.employeeManager"));
    this.formReport = this.buildForm({}, this.formConfig);
    this.getPeriodList();
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
  }

  ngOnInit() {
  }

  get f() {
    return this.formReport.controls;
  }

  getPeriodList() {
    this.employeeAssessmentReportService.getAssessmentPeriodList().subscribe(
      res => this.periodList = res.data
    );
  }

  processExportReport(type) {
    if (!CommonUtils.isValidForm(this.formReport)) {
      return;
    }
    if (type === 'detail') {
      this.employeeAssessmentReportService.exportDetailReport(this.formReport.value).subscribe(
        res => {
          saveAs(res, 'ctct_bao_cao_chi_tiet_danh_gia_nhan_su.xlsx');
        }
      );
    } else {
      this.employeeAssessmentReportService.exportTotalReport(this.formReport.value).subscribe(
        res => {
          saveAs(res, 'ctct_bao_cao_tong_hop_danh_gia_nhan_su.xlsx');
        }
      );
    }
  }

  onChangePeriod(event: any) {
    for (let item of this.periodList) {
      if (item.vtAssessmentPeriodId === event) {
        this.f['validFrom'].setValue(item.validFrom);
        this.f['validTo'].setValue(item.validTo);
        break;
      }
    }
  }
}
