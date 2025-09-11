import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { PartyReportService } from '@app/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import * as moment from 'moment';

@Component({
  selector: 'party-expired-detail-report',
  templateUrl: './party-expired-detail-report.component.html',
})
export class PartyExpiredDetailReportComponent extends BaseComponent implements OnInit {
  isMobileScreen: boolean = false;
  formConfig = {
    organizationId: [''],
    reportDate: [moment(new Date()).startOf('day').toDate().getTime(), Validators.required],
  };
  
  constructor(private partyReportService: PartyReportService) {
    super(null, CommonUtils.getPermissionCode("resource.employeeManager"));
    this.formSearch = this.buildForm({}, this.formConfig);
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
  }

  ngOnInit() {
  }

  get f() {
    return this.formSearch.controls;
  }

  processExportReport() {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    this.partyReportService.exportDetailPartyExpiredReport(this.formSearch.value).subscribe(
      res => {
        saveAs(res, 'ctct_bao_cao_chi_tiet_nien_han_can_bo.xlsx');
      }
    );
  }
}
