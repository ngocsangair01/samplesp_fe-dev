import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { APP_CONSTANTS } from '@app/core';
import { EmployeeReportService } from '@app/core/services/employee/employee-report.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';

@Component({
  selector: 'employee-report',
  templateUrl: './employee-report.component.html'
})
export class EmployeeReportComponent extends BaseComponent implements OnInit {

  public formEmployeeReport: FormGroup;
  public quarterList: Array<any>;
  public yearList: Array<any>;
  isMobileScreen: boolean = false;

  formConfig = {
    organizationId: ['', [ValidationService.required]],
    quarter: ['', [ValidationService.required]],
    year: ['', [ValidationService.required]]
  };
  constructor(private employeeReportService: EmployeeReportService) {
    super(null, CommonUtils.getPermissionCode("resource.employeeManager"));
    this.quarterList = APP_CONSTANTS.QUARTER_LIST;
    this.yearList = this.getYearList();
    this.formEmployeeReport = this.buildForm({}, this.formConfig);
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
  }

  ngOnInit() {
  }

  get f() {
    return this.formEmployeeReport.controls;
  }

  /**
   * Bao cao so luong can bo
   */
  processExport() {
    if (!CommonUtils.isValidForm(this.formEmployeeReport)) {
      return;
    }
    this.employeeReportService.export(this.formEmployeeReport.value).subscribe(
      res => {
        saveAs(res, 'ctct_bao_cao_so_luong_can_bo.xlsx');
      }
    )
  }

  private getYearList() {
    const yearList = [];
    const currentYear = new Date().getFullYear();
    for (let i = (currentYear - 50); i <= (currentYear + 50); i++) {
      const obj = {
        year: i
      };
      yearList.push(obj);
    }
    return yearList;
  }
}
