import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ACTION_FORM, APP_CONSTANTS } from '@app/core';
import { RetirementReportService } from '@app/core/services/employee/retirement_report.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import * as moment from 'moment';

@Component({
  selector: 'retirement-report',
  templateUrl: './retirement-report.component.html',
})
export class RetirementReportComponent extends BaseComponent implements OnInit {
  listType = APP_CONSTANTS.RETIREMENT_REPORT_TYPE;
  type: any;

  formConfig = {
    organizationId: ['', [ValidationService.required]],
    employeeId: [''],
    type: ['', [ValidationService.required]],
    reportDate: [moment(new Date()).startOf('day').toDate().getTime(), Validators.required],

  };

  formConfigInRetirement = {
    organizationId: ['', [ValidationService.required]],
    employeeId: [''],
    type: ['', [ValidationService.required]],
    fromDate: ['', [Validators.required]],
    toDate: ['', [Validators.required]],
  };

  constructor(private retirementReportService: RetirementReportService) {
    super(null, CommonUtils.getPermissionCode("resource.requestDemocraticMeeting"));
    this.formSearch = this.buildForm({}, this.formConfig);
    this.type = [];
  }

  ngOnInit() {
  }

  // get form
  get f() {
    return this.formSearch.controls;
  }

  /**
   * action loai bao cao
   * @param event 
   */
  public onChangeType(event) {
    if (event != null) {
      this.type = event;
      if (this.type == 2) {
        this.formSearch = this.buildForm(this.formSearch.value, this.formConfigInRetirement, ACTION_FORM.VIEW,
          [ValidationService.notAffter('fromDate', 'toDate', 'document.label.toDate')]);
      } else if (this.type == 1) {
        this.formSearch = this.buildForm(this.formSearch.value, this.formConfig);
      }
    } else {
      this.type = '';
      this.formSearch = this.buildForm(this.formSearch.value, this.formConfig);
    }
  }

  /**
   * Báo cáo tổng hợp niên hạn
   */
  processExportReport() {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    if (this.formSearch.value['type'] === 1) {
      this.retirementReportService.retirementReport(this.formSearch.value).subscribe(
        res => {
          saveAs(res, 'danh_sach_nghi_cho_huu.xls');
        }
      );
    } else if (this.formSearch.value['type'] === 2) {
      this.retirementReportService.inRetirementReport(this.formSearch.value).subscribe(
        res => {
          saveAs(res, 'danh_sach_nghi_huu_trong_ky.xls');
        }
      );
    }
  }
}