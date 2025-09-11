import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { FormGroup } from '@angular/forms';
import { ValidationService, CommonUtils } from '@app/shared/services';
import { FileControl } from '@app/core/models/file.control';
import { EmployeeReportService } from '@app/core/services/employee/employee-report.service';
import { AppComponent } from '@app/app.component';
import { APP_CONSTANTS } from '@app/core';
import { ReportDynamicService } from '@app/modules/reports/report-dynamic/report-dynamic.service';
import {saveAs} from "file-saver";

@Component({
  selector: 'employee-import',
  templateUrl: './employee-import.component.html',
  styleUrls: ['./employee-import.component.css']
})
export class EmployeeImportComponent extends BaseComponent implements OnInit {

  public formImportEmployee: FormGroup;
  public dataError: any;
  public quarterList: Array<any>;
  public yearList: Array<any>;
  private formImportConfig = {
    organizationId: ['', [ValidationService.required]],
    quarter: ['', [ValidationService.required]],
    year: ['', [ValidationService.required]]
  };
  formExport = {
    code: CommonUtils.getPermissionCode("resource.annualPlanReport"),
    organization_id: '',
    period_start_date: '',
    period_end_date: ''
  };
  currentDate = new Date();
  currentYear = this.currentDate.getFullYear();
  isMobileScreen: boolean = false;

  constructor(private employeeReportService: EmployeeReportService, private reportDynamicService: ReportDynamicService, private app: AppComponent) {
    super(null, CommonUtils.getPermissionCode("resource.employeeManager"));
    this.quarterList = APP_CONSTANTS.QUARTER_LIST;
    this.yearList = this.getYearList();
    this.formImportEmployee = this.buildForm({}, this.formImportConfig);
    this.formImportEmployee.addControl('fileImport', new FileControl(null, ValidationService.required));
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
  }

  ngOnInit() {
  }

  get f() {
    return this.formImportEmployee.controls;
  }

  processImport() {
    this.formImportEmployee.controls['fileImport'].updateValueAndValidity();
    if (!CommonUtils.isValidForm(this.formImportEmployee)) {
      return;
    }
    this.app.confirmMessage(null, () => {// on accepted
      this.employeeReportService.processImport(this.formImportEmployee.value).subscribe(res => {
        if (res.type !== 'SUCCESS') {
          this.dataError = res.data;
        } else {
          this.dataError = null;
        }
      });
    }, () => {
      // on rejected
    });
  }

  processDownloadTemplate() {
    this.employeeReportService.downloadTemplateImport().subscribe(res => {
      saveAs(res, 'template_employee_report.xls');
    });
  }

  processDownloadTemplateWithData() {
    let quarter = this.formImportEmployee.controls['quarter'].value;
    let year = this.formImportEmployee.controls['year'].value;

    if (!quarter || !year) {
      quarter = CommonUtils.getQuarter(this.currentDate);
      year = this.currentYear;
    }

    this.formExport.organization_id = this.formImportEmployee.controls['organizationId'].value;
    this.formExport.period_start_date = this.makePeriodStartDate(quarter, year).getTime().toString();
    this.formExport.period_end_date = this.makePeriodEndDate(quarter, year).getTime().toString();

    this.reportDynamicService.export(this.formExport).subscribe(res => {
      saveAs(res, 'template_employee_report.xls');
    });
  }

  private getYearList() {
    const yearList = [];
    for (let i = (this.currentYear - 50); i <= (this.currentYear + 50); i++) {
      const obj = {
        year: i
      };
      yearList.push(obj);
    }
    return yearList;
  }

  private makePeriodStartDate(quarter, year) {
    let month = quarter * 3 - 2;
    return new Date(year, month, 1);
  }

  private makePeriodEndDate(quarter, year) {
    let month = quarter * 3;
    return new Date(year, month + 1, 0);
  }
}
