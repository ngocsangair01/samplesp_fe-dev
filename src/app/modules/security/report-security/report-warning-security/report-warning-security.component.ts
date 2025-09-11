import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ACTION_FORM, APP_CONSTANTS } from '@app/core';
import { CurriculumVitaeService } from '@app/core/services/employee/curriculum-vitae.service';
import { WorkProcessService } from '@app/core/services/employee/work-process.service';
import { ReportWorkWarningSecurityService } from '@app/core/services/security/report-work-warnings.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';

@Component({
  selector: 'report-warning-security',
  templateUrl: './report-warning-security.component.html',
  styleUrls: ['./report-warning-security.component.css']
})
export class ReportWarningSecurityComponent extends BaseComponent implements OnInit {
  public reportTypeList = [];
  formSearch: FormGroup;
  view: boolean;
  formConfig = {
    organizationId: [''],
    fromDate: [null],
    toDate: [null],
    reportTypeId: ['', [ValidationService.required]]
  };

  constructor(
    private reportWorkWarningSecurityService: ReportWorkWarningSecurityService,
    private curriculumVitaeService: CurriculumVitaeService,
    private workProcessService: WorkProcessService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.securityProtection"));
    this.reportTypeList = APP_CONSTANTS.REPORT_WARNING_SECURITY_TYPE_LIST;
    this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW, []);
    this.view = false;
  }

  ngOnInit() {
  }

  get f() {
    return this.formSearch.controls;
  }

  public processExportReport() {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    const credentials = Object.assign({}, this.formSearch.value);
    const searchData = CommonUtils.convertData(credentials);
    const params = CommonUtils.buildParams(searchData);
    if (this.formSearch.controls['reportTypeId'].value === 1) {
      this.curriculumVitaeService.exportPoliticsNeedToPayAttenion(params).subscribe(res => {
        saveAs(res, 'Danh sách CBNV cần chú ý về tiêu chuẩn chính trị.xlsx');
      });
    } else if (this.formSearch.controls['reportTypeId'].value === 2) {
      this.reportWorkWarningSecurityService.reportEmployeeChangeWork(params).subscribe(res => {
        saveAs(res, 'Báo cáo nhân sự trọng yếu thay đổi công tác.xlsx');
      });
    } else if (this.formSearch.controls['reportTypeId'].value === 3) {
      this.workProcessService.processExportKeyPositionNotEnoughFile(params).subscribe(res => {
        saveAs(res, 'BC_Danh_sach_nhan_su_trong_yeu_thieu_ho_so.xlsx');
      });
    }
  }

  public onChangeReportType(event?) {
    if (event && event === 2) {
      this.view = true;
      this.formSearch.removeControl('fromDate');
      this.formSearch.addControl('fromDate', new FormControl(null, [ValidationService.required]));
      this.formSearch.removeControl('toDate');
      this.formSearch.addControl('toDate', new FormControl(null, [ValidationService.required]));
      this.formSearch.setValidators([ValidationService.notAffter('fromDate', 'toDate', 'partyOrganization.toDate')]);
    } else {
      this.view = false;
      this.formSearch.clearValidators();
      this.formSearch.removeControl('fromDate');
      this.formSearch.addControl('fromDate', new FormControl(null, []));
      this.formSearch.removeControl('toDate');
      this.formSearch.addControl('toDate', new FormControl(null, []));
    }
  }
}