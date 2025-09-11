import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { APP_CONSTANTS } from '@app/core';
import { PartyMemberReportService } from '@app/core/services/party-organization/party-member-report.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';

@Component({
  selector: 'party-member-report',
  templateUrl: './party-member-report.component.html'
})
export class PartyMemberReportComponent extends BaseComponent implements OnInit {

  public formPartyMemberReport: FormGroup;
  partyMemberReportTypeList: Array<any>;
  formConfig = {
    partyOrganizationId: ['', [ValidationService.required]],
    reportTypeId: ['', [ValidationService.required]]
  };
  constructor(
    public partyMemberReportService: PartyMemberReportService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.partyMember"));
    this.formPartyMemberReport = this.buildForm({}, this.formConfig);
    this.partyMemberReportTypeList = APP_CONSTANTS.PARTY_MEMBER_REPORT_TYPE_LIST;
  }

  ngOnInit() {
  }

  get f() {
    return this.formPartyMemberReport.controls;
  }

  /**
   * Bao cao so luong can bo
   */
  processExport() {
    if (!CommonUtils.isValidForm(this.formPartyMemberReport)) {
      return;
    }
    if (this.formPartyMemberReport.controls['reportTypeId'].value === 1) {
      this.partyMemberReportService.exportPartyMemberDetails(this.formPartyMemberReport.value).subscribe(res => {
        saveAs(res, 'ctct_bao_cao_chi_tiet_so_lieu_Dang_vien.xlsx');
      });
    } else {
      // TODO bao cao tong hop so luong Dang vien theo to chuc Dang 
      this.partyMemberReportService.exportPartyMemberTotal(this.formPartyMemberReport.value).subscribe(res => {
        saveAs(res, "ctct_bao_cao_tong_hop_so_lieu_Dang_vien.xlsx")
      });

    }
  }
}
