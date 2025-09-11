import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { APP_CONSTANTS } from '@app/core';
import { ReligionReportService } from '@app/core/services/employee/religion-report.service';
import { SysCatService } from '@app/core/services/sys-cat/sys-cat.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { TranslationService } from 'angular-l10n';
import * as moment from 'moment';


@Component({
  selector: 'religion-report',
  templateUrl: './religion-report.component.html',
  styleUrls: ['./religion-report.component.css']
})
export class ReligionReportComponent extends BaseComponent implements OnInit {

  public religionList: any;

  formConfig = {
    organizationId: [''],
    reportedDate: [moment(new Date()).startOf('day').toDate().getTime(), Validators.required],
    gender: ['0'],
    managementTypeId: ['0'],
    isPartyMember: ['0'],
    religionIds: ['']
  };

  constructor(public translation: TranslationService,
    public sysCatService: SysCatService,
    public religionReportService: ReligionReportService) {
    super(null, CommonUtils.getPermissionCode("resource.requestDemocraticMeeting"));
    this.formSearch = this.buildForm({}, this.formConfig);
  }

  ngOnInit() {
    this.sysCatService.findBySysCatTypeId(APP_CONSTANTS.SYS_CAT_TYPE_ID.RELIGION).subscribe(res => {
      this.religionList = res.data;
      this.religionList.sort(function (a, b) {
        return a.name.localeCompare(b.name);
      });
    })
  }

  get f() {
    return this.formSearch.controls;
  }

  /**
   * Báo cáo chi tiết CBCNV theo tôn giáo
   */
  processExportReligionDetail() {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    this.religionReportService.processReligionReportDetail(this.formSearch.value).subscribe(
      res => {
        saveAs(res, 'ctct_bao_cao_chi_tiet_cbcnv_theo_ton_giao.xlsx');
      }
    )
  }

  processReligionReportGeneral() {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    this.religionReportService.processReligionReportGeneral(this.formSearch.value).subscribe(
      res => {
        saveAs(res, 'ctct_bao_cao_tong_hop_cbcnv_theo_ton_giao.xlsx');
      }
    );
  }

}
