import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ACTION_FORM } from '@app/core';
import { OrgDemocraticMeetingService } from '@app/core/services/population/org-democratic-meeting.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';

@Component({
  selector: 'org-democratic-meeting-report',
  templateUrl: './org-democratic-meeting-report.component.html',
  styleUrls: ['./org-democratic-meeting-report.component.css']
})
export class OrgDemocraticMeetingReportComponent extends BaseComponent implements OnInit {
  empTypeList: any;
  formExport: FormGroup;
  formConfig = {
    fromDate: ['', [ValidationService.required, ValidationService.beforeCurrentDate]],
    toDate: ['', ValidationService.required],
    organizationId: ['', [ValidationService.required]],
  };

  constructor(
    private orgDemocraticMeetingService: OrgDemocraticMeetingService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.requestDemocraticMeeting"));
    this.formExport = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW,
      [ValidationService.notAffter('fromDate', 'toDate', 'common.label.toDate')]);
  }

  ngOnInit() {

  }

  get f() {
    return this.formExport.controls;
  }

  /**
   * Báo cáo đối tượng chính sách
   */
  processReportEmpTypePolicy() {
    if (!CommonUtils.isValidForm(this.formExport)) {
      return;
    }
    this.orgDemocraticMeetingService.orgDemocraticMeetingReport(this.formExport.value).subscribe(
      res => {
        saveAs(res, 'ctct_bao_cao_hop_dan_chu_theo_don_vi.xlsx');
      }
    )
  }
}