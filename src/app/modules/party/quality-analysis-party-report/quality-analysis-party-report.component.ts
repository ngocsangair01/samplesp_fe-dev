import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { APP_CONSTANTS } from '@app/core/app-config';
import { QualityAnalysisPartyReportService } from '@app/core/services/party-organization/quality-analysis-party-report.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';

@Component({
  selector: 'quality-analysis-party-report',
  templateUrl: './quality-analysis-party-report.component.html',
  styleUrls: ['./quality-analysis-party-report.component.css']
})
export class QualityAnalysisPartyReportComponent extends BaseComponent implements OnInit {

  public formQualityAnalysisReport: FormGroup;
  public reportTypeList: Array<any>;
  public yearList: Array<any>;
  isMobileScreen: boolean = false;
  formConfig = {
    reportTypeId: ['', [ValidationService.required]],
    partyOrganizationId: ['', [ValidationService.required]],
    year: ['', [ValidationService.required]]
  };
  constructor(
    private qualityAnalysisPartyReportService: QualityAnalysisPartyReportService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.qualityAnalysisParty"));
    this.reportTypeList = APP_CONSTANTS.REPORT_TYPE_LIST;
    this.formQualityAnalysisReport = this.buildForm({}, this.formConfig);
    this.formQualityAnalysisReport.controls["year"].setValue(new Date().getFullYear());
    this.yearList = this.getYearList();
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
  }

  ngOnInit() {
  }

  get f() {
    return this.formQualityAnalysisReport.controls;
  }

  processExport() {
    if (!CommonUtils.isValidForm(this.formQualityAnalysisReport)) {
      return;
    }
    if (this.formQualityAnalysisReport.controls["reportTypeId"].value == 1) {
      this.qualityAnalysisPartyReportService.processPartyQualityReport(this.formQualityAnalysisReport.value).subscribe(
        res => {
          saveAs(res, 'ctct_bao_cao_xep_loai_to_chuc_dang.xlsx');
        }
      )
    } else if (this.formQualityAnalysisReport.controls["reportTypeId"].value == 2) {
      this.qualityAnalysisPartyReportService.processPartyMemberQualityReport(this.formQualityAnalysisReport.value).subscribe(
        res => {
          saveAs(res, 'ctct_bao_cao_xep_loai_dang_vien.xlsx');
        }
      )
    } else if (this.formQualityAnalysisReport.controls["reportTypeId"].value == 3) {
      this.qualityAnalysisPartyReportService.partyClassificationReport(this.formQualityAnalysisReport.value).subscribe(
        res => {
          saveAs(res, 'ctct_bao_cao_tong_hop_xep_loai_to_chuc_Dang.xlsx');
        }
      )
    } else if (this.formQualityAnalysisReport.controls["reportTypeId"].value == 4) {
      this.qualityAnalysisPartyReportService.processTotalPartyMemberQualityReport(this.formQualityAnalysisReport.value).subscribe(
        res => {
          saveAs(res, 'ctct_bao_cao_tong_hop_xep_loai_dang_vien.xlsx');
        }
      )
    } else if (this.formQualityAnalysisReport.controls["reportTypeId"].value == 5) {
      this.qualityAnalysisPartyReportService.processTotalPartyOrgMemberQualityReport(this.formQualityAnalysisReport.value).subscribe(
        res => {
          saveAs(res, 'ctct_bc_tong_hop_xep_loai_dang_dang_vien.xlsx');
        }
      )
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
