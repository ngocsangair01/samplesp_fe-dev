import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { PartyCongressEmployeeService } from '@app/core/services/party-organization/party-congress-employee.service';
import { CommonUtils, ValidationService } from '@app/shared/services';

@Component({
  selector: 'party-congress-employee-report',
  templateUrl: './party-congress-employee-report.component.html'
})
export class PartyCongressEmployeeReportComponent extends BaseComponent implements OnInit {

  formConfig = {
    partyOrganizationId: ['', [ValidationService.required]]
  };
  constructor(
    private partyCongressEmployeeService: PartyCongressEmployeeService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.partyCongressEmployee"));
    this.setMainService(partyCongressEmployeeService);
    this.formSearch = this.buildForm({}, this.formConfig);
  }

  ngOnInit() {
  }

  get f() {
    return this.formSearch.controls;
  }

  processExport() {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    this.partyCongressEmployeeService.exportListPartyCongressEmployee(this.formSearch.value).subscribe(
      res => {
        saveAs(res, 'ctct_bao_cao_nhan_su_dai_hoi.xlsx');
      }
    )
  }
}
