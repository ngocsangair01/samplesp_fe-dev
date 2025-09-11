import { Component, OnInit, ViewChildren } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { FileControl } from '@app/core/models/file.control';
import { RewardPartyMemberService } from '@app/core/services/party-organization/reward-party-member.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { PartyOrgSelectorComponent } from '@app/shared/components/party-org-selector/party-org-selector.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import * as moment from 'moment';

@Component({
  selector: 'reward-party-member-import',
  templateUrl: './reward-party-member-import.component.html',
})
export class RewardPartyMemberImportComponent extends BaseComponent implements OnInit {
  yearList = [];
  formImport: FormGroup;
  dataError: any;
  formConfig = {
    partyOrganizationId: ['', [Validators.required]],
    importDate: [moment(new Date()).startOf('day').toDate().getTime(), [Validators.required]],
    content: ['', [Validators.maxLength(1000)]],
    year: ['', [Validators.required]],
  };
  @ViewChildren('partyOrgSelector')
  public partyOrgSelector;
  constructor(
    private rewardPartyMemberService: RewardPartyMemberService,
    private app: AppComponent,
    private router: Router,
  ) {
    super(null, CommonUtils.getPermissionCode("resource.rewardParty"));
    this.formImport = this.buildForm({}, this.formConfig);
    this.formImport.addControl('fileImport', new FileControl(null, [Validators.required]));
    this.yearList = this.getYearList();
  }

  ngOnInit() {
  }

  get f() {
    return this.formImport.controls;
  }

  private getYearList() {
    this.yearList = [];
    const currentYear: number = new Date().getFullYear();
    this.formImport.controls['year'].setValue(currentYear);
    for (let i = (currentYear - 50); i <= (currentYear + 10); i++) {
      const obj = {
        year: i
      };
      this.yearList.push(obj);
    }
    return this.yearList;
  }

  processDownloadTemplate() {
    this.formImport.controls['fileImport'].clearValidators();
    this.formImport.controls['fileImport'].updateValueAndValidity();
    if (!CommonUtils.isValidForm(this.formImport)) {
      this.formImport.controls['fileImport'].setValidators(ValidationService.required);
      return;
    }
    const params = this.formImport.value;
    delete params['fileImport'];
    this.rewardPartyMemberService.downloadTemplate(this.formImport.value).subscribe(
      res => {
        saveAs(res, 'reward_party_member_template.xls');
      }
    );
    this.formImport.controls['fileImport'].setValidators(ValidationService.required);
  }

  goBack() {
    this.router.navigate(['/party-organization/reward-party-member']);
  }

  processImport() {
    this.formImport.controls['fileImport'].updateValueAndValidity();
    if (!CommonUtils.isValidForm(this.formImport)) {
      return;
    }
    this.app.confirmMessage(null, () => {// on accepted
      this.rewardPartyMemberService.processImport(this.formImport.value).subscribe(
        res => {
          if (this.rewardPartyMemberService.requestIsSuccess(res)) {
            this.goBack();
          } else {
            if (typeof res.data === typeof {}) {
              this.dataError = res.data;
            }
          }
        }
      );
    }, () => {// on reject
    });
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
}