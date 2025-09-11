import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CommonUtils } from '@app/shared/services';
import { PartyMemberReportService } from './../../../../core/services/party-organization/party-member-report.service';
import { BaseComponent } from './../../../../shared/components/base-component/base-component.component';
import { ValidationService } from './../../../../shared/services/validation.service';

@Component({
  selector: 'party-transfer-report',
  templateUrl: './party-transfer-report.component.html'
})
export class PartyTransferReportComponent extends BaseComponent implements OnInit {
  formReport: FormGroup;
  formConfig = {
    organizationId: ['', [ValidationService.required]],
    synthetic: [''],
  }
  constructor(
    public partyMemberReportService: PartyMemberReportService,
  ) {
    super(null, CommonUtils.getPermissionCode("resource.partyMember"));
    this.formReport = this.buildForm({}, this.formConfig);
  }

  processExportReport() {
    if (!CommonUtils.isValidForm(this.formReport)) {
      return;
    }
    if (this.formReport.controls['synthetic'].value !== true) {
      // Xuất báo cáo bình thường không tổng hợp
      this.partyMemberReportService.exportNotYetTransferPartyMember({ organizationId: this.formReport.controls['organizationId'].value })
        .subscribe(res => {
          saveAs(res, "ctct_bao_cao_Dang_vien_chua_chuyen_sinh_hoat_Dang.xlsx")
        });
    } else {
      // Xuất báo cáo tổng hợp theo các đơn vị con trực tiếp với đơn vị được chọn
      this.partyMemberReportService.exportNotYetTransferPartyMemberHaveSynthetic({ organizationId: this.formReport.controls['organizationId'].value })
        .subscribe(res => {
          saveAs(res, "ctct_bao_cao_Dang_vien_chua_chuyen_sinh_hoat_Dang.xlsx")
        });
    }

  }
  ngOnInit() {
  }
  get f() {
    return this.formReport.controls;
  }
}
