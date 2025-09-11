import { CommonUtils } from './../../../../shared/services/common-utils.service';
import { PartyCriticizeService } from './../../../../core/services/party-organization/party-criticize.service';
import { BaseComponent } from './../../../../shared/components/base-component/base-component.component';
import { ValidationService } from './../../../../shared/services/validation.service';
import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'report-party-criticize',
  templateUrl: './report-party-criticize.component.html'
})
export class ReportPartyCriticizeComponent extends BaseComponent implements OnInit {
  public formReportCriticize: FormGroup;
  public yearList: Array<any>;
  constructor(
    private partyCriticizeService: PartyCriticizeService,
  ) {
    super(null, CommonUtils.getPermissionCode("resource.partyCriticize"));
    this.setMainService(partyCriticizeService);
    this.formReportCriticize = this.buildForm({}, this.formConfig);
    this.formReportCriticize.controls["year"].setValue(new Date().getFullYear());
  }
  formConfig = {
    partyOrganizationId: ['', [ValidationService.required]],
    year: ['', [ValidationService.required]]
  }
  ngOnInit() {
    this.yearList = this.getYearList();
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
  get f() {
    return this.formReportCriticize.controls;
  }
  public processExport() {
    if (!CommonUtils.isValidForm(this.formReportCriticize)) {
      return;
    }
    const credentials = Object.assign({}, this.formReportCriticize.value);
    const searchData = CommonUtils.convertData(credentials);
    const params = CommonUtils.buildParams(searchData);
    this.partyCriticizeService.export(params).subscribe(res => {
      saveAs(res, 'party_criticize-report.xlsx');
    })
  }
}
