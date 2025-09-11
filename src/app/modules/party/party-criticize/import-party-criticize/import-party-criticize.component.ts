import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { FileControl } from '@app/core/models/file.control';
import { PartyCriticizeService } from '@app/core/services/party-organization/party-criticize.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services/common-utils.service';
import { ValidationService } from '@app/shared/services/validation.service';

@Component({
  selector: 'import-party-criticize',
  templateUrl: './import-party-criticize.component.html',
})
export class ImportPartyCriticizeComponent extends BaseComponent implements OnInit {
  public formInportCriticize: FormGroup;
  public dataError: any;
  public yearList: Array<any>;
  formConfig = {
    partyOrganizationId: ['', [ValidationService.required]],
    year: ['', [ValidationService.required]]
  }
  constructor(private partyCriticizeService: PartyCriticizeService,
    private app: AppComponent,
    private router: Router) {
    super(null, CommonUtils.getPermissionCode("resource.partyCriticize"));
    this.setMainService(partyCriticizeService);
    this.formInportCriticize = this.buildForm({}, this.formConfig);
    this.formInportCriticize.addControl('fileImport', new FileControl(null, ValidationService.required));
    this.formInportCriticize.controls["year"].setValue(new Date().getFullYear());

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
    return this.formInportCriticize.controls;
  }
  /**
   * file template
   */
  processDownloadTemplate() {
    // const credentials = Object.assign({}, this.formInportCriticize.value);
    // const searchData = CommonUtils.convertData(credentials);
    // const params = CommonUtils.buildParams(searchData);
    this.partyCriticizeService.downloadTemplateImport().subscribe(res => {
      saveAs(res, 'party_criticize_report_template.xls');
    });
  }
  /**
   * import
   */
  processImport() {
    this.formInportCriticize.controls['fileImport'].updateValueAndValidity();
    if (!CommonUtils.isValidForm(this.formInportCriticize)) {
      return;
    }
    this.app.confirmMessage(null, () => {// on accepted
      this.partyCriticizeService.processImport(this.formInportCriticize.value).subscribe(res => {
        if (res.type !== 'SUCCESS') {
          this.dataError = res.data;
        } else {
          this.dataError = null;
          this.goBack();
        }
      });
    }, () => {
      // on rejected
    });
  }
  public onChangePartyOrg(data, partyOrgSelect) {
    if (data.partyOrganizationId) {
      if (data.parentId !== 1) {
        this.app.errorMessage('transferPartyMember.mustBeOnParty');
        partyOrgSelect.delete();
        return;
      }
    }
  }

  public goBack() {
    this.router.navigate(['/party-organization/party-criticize']);
  }
}
