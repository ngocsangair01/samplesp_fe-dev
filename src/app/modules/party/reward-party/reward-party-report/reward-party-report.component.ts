import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { RewardPartyReportService } from '@app/core/services/party-organization/reward-party-report.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { APP_CONSTANTS } from './../../../../core/app-config';

@Component({
  selector: 'reward-party-report',
  templateUrl: './reward-party-report.component.html',
  styleUrls: ['./reward-party-report.component.css']
})
export class RewardPartyReportComponent extends BaseComponent implements OnInit {
  public formReport: FormGroup;
  public reportTypeList: Array<any>;
  public yearList: Array<any>;
  isMobileScreen: boolean = false;
  formConfig = {
    reportTypeId: ['', [ValidationService.required]],
    partyOrganizationId: ['', [ValidationService.required]],
    year: ['', [ValidationService.required]]
  };
  constructor(
    private rewardPartyReportService: RewardPartyReportService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.rewardParty"));
    this.reportTypeList = APP_CONSTANTS.REPORT_REWARD_TYPE_LIST;
    this.formReport = this.buildForm({}, this.formConfig);
    this.formReport.controls["year"].setValue(new Date().getFullYear());
    this.yearList = this.getYearList();
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
  }

  ngOnInit() {
  }

  get f() {
    return this.formReport.controls;
  }

  processExport() {
    if (!CommonUtils.isValidForm(this.formReport)) {
      return;
    }
    let type = this.f['reportTypeId'].value;
    if (type === 1) {
      this.rewardPartyReportService.exportRewardYearPartyOrganization(this.formReport.value).subscribe(
        res => {
          saveAs(res, 'ctct_bao_cao_khen_thuong_to_chuc_dang_nam_' + this.formReport.value.year + '.xlsx');
        }
      );
    } else if (type === 2) {
      this.rewardPartyReportService.exportRewardYearPartyMember(this.formReport.value).subscribe(
        res => {
          saveAs(res, 'ctct_bao_cao_khen_thuong_dang_vien_nam_' + this.formReport.value.year + '.xlsx');
        }
      );
    } else if (type === 3) {
      this.rewardPartyReportService.exportTotalRewardParty(this.formReport.value).subscribe(
        res => {
          saveAs(res, 'ctct_bao_cao_khen_thuong_dang_nam_' + this.formReport.value.year + '.xlsx');
        }
      );
    }
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
