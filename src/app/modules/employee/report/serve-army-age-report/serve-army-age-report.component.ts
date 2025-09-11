import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { PartyReportService } from '@app/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import * as moment from 'moment';

@Component({
  selector: 'serve-army-age-report',
  templateUrl: './serve-army-age-report.component.html',
})
export class ServeArmyAgeReportComponent extends BaseComponent implements OnInit {
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
    this.partyReportService.exportServeArmyAgeDetailReport(this.formSearch.value).subscribe(
      res => {
        saveAs(res, 'ctct_bao_cao_chi_tiet_tuoi_PVTN_cua_si_quan.xlsx');
      }
    );
  }
}
