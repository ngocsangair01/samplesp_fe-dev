import { Component, OnInit, ViewChildren } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { FileControl } from '@app/core/models/file.control';
import { PartyMemebersService } from '@app/core/services/party-organization/party-members.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { PartyOrgSelectorComponent } from '@app/shared/components/party-org-selector/party-org-selector.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { TranslationService } from 'angular-l10n';

@Component({
  selector: 'party-member-form-import-clone',
  templateUrl: './party-member-form-import-clone.component.html'
})
export class PartyMemberFormImportCloneComponent extends BaseComponent implements OnInit {

  public formImportPartyMember: FormGroup;
  public dataError: any;
  private formImportConfig = {
    partyOrganizationId: ['', [ValidationService.required]]
  };

  @ViewChildren('partyOrgSelector')
  public partyOrgSelector;

  constructor(private partyMemebersService: PartyMemebersService,
    public translation: TranslationService,
    private app: AppComponent,
    private router: Router) {
    super(null, CommonUtils.getPermissionCode("resource.partyMember"));
    this.formImportPartyMember = this.buildForm({}, this.formImportConfig);
    this.formImportPartyMember.addControl('fileImport', new FileControl(null, ValidationService.required));
  }

  ngOnInit() {
  }

  get f() {
    return this.formImportPartyMember.controls;
  }

  processImport() {
    this.formImportPartyMember.controls['fileImport'].updateValueAndValidity();
    if (!CommonUtils.isValidForm(this.formImportPartyMember)) {
      return;
    }
    this.app.confirmMessage(null, () => {// on accepted
      this.partyMemebersService.processImport(this.formImportPartyMember.value).subscribe(res => {
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

  processDownloadTemplate() {
    this.formImportPartyMember.controls['fileImport'].clearValidators();
    this.formImportPartyMember.controls['fileImport'].updateValueAndValidity();
    if (!CommonUtils.isValidForm(this.formImportPartyMember)) {
      return;
    }
    const params = this.formImportPartyMember.value;
    delete params['fileImport'];
    this.partyMemebersService.downloadTemplateImport(params).subscribe(res => {
      saveAs(res, 'template_party_member.xls');
    });
    this.formImportPartyMember.controls['fileImport'].setValidators(ValidationService.required);
  }

  public goBack() {
    this.router.navigate(['/party-organization/party-member-clone']);
  }

  public onChangePartyOrg(data) {
    if (data.partyOrganizationId) {
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
