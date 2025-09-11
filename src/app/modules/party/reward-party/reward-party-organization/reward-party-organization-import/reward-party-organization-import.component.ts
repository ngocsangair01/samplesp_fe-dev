import { Component, OnInit, ViewChildren } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { FileControl } from '@app/core/models/file.control';
import { RewardPartyOrganizationService } from '@app/core/services/party-organization/reward-party-organization.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { PartyOrgSelectorComponent } from '@app/shared/components/party-org-selector/party-org-selector.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
;
import * as moment from 'moment';

@Component({
  selector: 'reward-party-organization-import',
  templateUrl: './reward-party-organization-import.component.html',
})
export class RewardPartyOrganizationImportComponent extends BaseComponent implements OnInit {
  listYear = [];
  formImport: FormGroup;
  dataError: any;
  formConfig = {
    importDate: [moment(new Date()).startOf('day').toDate().getTime(), ValidationService.required],
    partyOrganizationId: ['', [ValidationService.required]],
    year: [parseInt(moment(new Date()).format('YYYY')), [ValidationService.required]],
    content: ['', [ValidationService.maxLength(1000)]]
  };

  @ViewChildren('partyOrgSelector')
  public partyOrgSelector;
  constructor(
    private rewardPartyOrganizationService: RewardPartyOrganizationService,
    private app: AppComponent,
    private router: Router,
  ) {
    super(null, CommonUtils.getPermissionCode("resource.rewardParty"));
    this.formImport = this.buildForm({}, this.formConfig);
    this.formImport.addControl('fileImport', new FileControl(null, [Validators.required]));
    this.listYear = this.getYearList();
  }

  ngOnInit() {
  }

  get f() {
    return this.formImport.controls;
  }

  private getYearList() {
    this.listYear = [];
    const currentYear: number = new Date().getFullYear();
    this.formImport.controls['year'].setValue(currentYear);
    for (let i = (currentYear - 50); i <= (currentYear + 10); i++) {
      const obj = {
        year: i
      };
      this.listYear.push(obj);
    }
    return this.listYear;
  }

  processDownloadTemplate() {
    this.formImport.controls['fileImport'].clearValidators();
    this.formImport.controls['fileImport'].updateValueAndValidity();
    if (!CommonUtils.isValidForm(this.formImport)) {
      return;
    }
    const params = this.formImport.value;
    delete params['fileImport'];
    this.rewardPartyOrganizationService.downloadTemplate(this.formImport.value).subscribe(
      res => {
        saveAs(res, 'reward_party_organization_template.xls');
      }
    );
    this.formImport.controls['fileImport'].setValidators(ValidationService.required);
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

  goBack() {
    this.router.navigate(['/party-organization/reward-party-organization']);
  }

  processImport() {
    this.formImport.controls['fileImport'].updateValueAndValidity();
    if (!CommonUtils.isValidForm(this.formImport)) {
      return;
    }
    this.app.confirmMessage(null, () => {// on accepted
      this.rewardPartyOrganizationService.processImport(this.formImport.value).subscribe(
        res => {
          if (this.rewardPartyOrganizationService.requestIsSuccess(res)) {
            this.goBack();
          } else if (res.type === 'ERROR') {
            this.dataError = res.data;
          }
        }
      );
    }, () => {// on reject
    });
  }
}
