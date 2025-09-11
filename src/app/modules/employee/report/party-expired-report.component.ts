import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { PartyReportService } from '@app/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import * as moment from 'moment';
import {saveAs} from "file-saver";


@Component({
  selector: 'party-expired-report',
  templateUrl: './party-expired-report.component.html',
  styleUrls: ['./party-expired-report.component.css']
})
export class PartyExpiredReportComponent extends BaseComponent implements OnInit {
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

  // get form
  get f() {
    return this.formSearch.controls;
  }

  /**
   * Báo cáo tổng hợp niên hạn
   */
  processExportReport() {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    this.partyReportService.processPartyExpiredReport(this.formSearch.value).subscribe(
      res => {
        saveAs(res, 'ctct_bao_cao_nien_han_can_bo.xls');
      }
    )
  }

  /**
   * Báo cáo chi tiết niên hạn
   */
  processExportReportDetail() {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    this.partyReportService.processPartyExpiredReportDetail(this.formSearch.value).subscribe(
      res => {
        saveAs(res, 'ctct_bao_cao_chi_tiet_nien_han_can_bo.xlsx');
      }
    );
  }
}
