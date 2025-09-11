import { Component, OnInit, ViewChildren } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { AppComponent } from '@app/app.component';
import { PartyMemberReportService } from '@app/core/services/party-organization/party-member-report.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { PartyOrgSelectorComponent } from '@app/shared/components/party-org-selector/party-org-selector.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'committees-report',
  templateUrl: './committees-report.component.html',
})
export class CommitteesReportComponent extends BaseComponent implements OnInit {
  formReport: FormGroup;
  @ViewChildren('partyOrgSelector')
  public partyOrgSelector;
  constructor(
    private app: AppComponent,
    public partyMemberReportService: PartyMemberReportService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.partyMember"));
    this.formReport = this.buildForm({}, { partyOrganizationId: ['', [Validators.required]] });
  }

  ngOnInit() {
  }

  get f() {
    return this.formReport.controls;
  }

  public onChangePartyOrg(data) {
    if (data.partyOrganizationId && data.partyOrganizationId > 0) {
      const currentDate = new Date();
      if (data.expiredDate === null) {
        const effectiveDate = new Date(data.effectiveDate);
        if (effectiveDate > currentDate) {
          this.app.errorMessage('partymember.partyOrganizationNotEffectYet');
          (this.partyOrgSelector.first as PartyOrgSelectorComponent).delete();
        }
      } else {
        const expiredDate = new Date(data.expiredDate);
        if (expiredDate < currentDate) {
          this.app.errorMessage('partymember.partyOrganizationExpired');
          (this.partyOrgSelector.first as PartyOrgSelectorComponent).delete();
        }
      }
    }
  }

  processExportReport() {
    if (!CommonUtils.isValidForm(this.formReport)) {
      return;
    }
    this.partyMemberReportService.exportCommitteesReport(this.formReport.value).subscribe(
      res => {
        saveAs(res, 'ctct_bao_cao_danh_sach_cap_uy.xlsx');
      }
    );
  }
}
