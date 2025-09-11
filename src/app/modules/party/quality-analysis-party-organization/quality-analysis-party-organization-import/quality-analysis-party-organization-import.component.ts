import { Component, OnInit, ViewChildren } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { FileControl } from '@app/core/models/file.control';
import { QualityAnalysisPartyOrgService } from '@app/core/services/party-organization/quality-analysis-party-org.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { PartyOrgSelectorComponent } from '@app/shared/components/party-org-selector/party-org-selector.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { TranslationService } from 'angular-l10n';
import * as moment from 'moment';

@Component({
  selector: 'quality-analysis-party-organization-import',
  templateUrl: './quality-analysis-party-organization-import.component.html'
})
export class QualityAnalysisPartyOrganizationImportComponent extends BaseComponent implements OnInit {

  formImport: FormGroup;
  formConfig = {
    importDate: [moment(new Date()).startOf('day').toDate().getTime(), ValidationService.required],
    partyOrganizationId: ['', [ValidationService.required]],
    year: [parseInt(moment(new Date()).format('YYYY')), [ValidationService.required]],
    content: ['', [ValidationService.maxLength(1000)]]
  };
  public listYear: any;
  public listQualityRating: any;
  @ViewChildren('partyOrgSelector')
  public partyOrgSelector;
  public dataError: any;
  constructor(private qualityAnalysisPartyOrgService: QualityAnalysisPartyOrgService,
    public translation: TranslationService,
    private app: AppComponent,
    private router: Router) {
    super(null, CommonUtils.getPermissionCode("resource.qualityAnalysisParty"));
    this.listYear = this.getYearList();
    this.formImport = this.buildForm({}, this.formConfig);
    this.formImport.addControl('fileImport', new FileControl(null, ValidationService.required));
  }

  ngOnInit() {
  }

  get f() {
    return this.formImport.controls;
  }

  private getYearList() {
    this.listYear = [];
    const currentYear = new Date().getFullYear();
    for (let i = (currentYear - 50); i <= (currentYear + 10); i++) {
      const obj = {
        year: i
      };
      this.listYear.push(obj);
    }
    return this.listYear;
  }

  processImport() {
    this.formImport.controls['fileImport'].updateValueAndValidity();
    if (!CommonUtils.isValidForm(this.formImport)) {
      return;
    }
    this.app.confirmMessage(null, () => {// on accepted
      this.qualityAnalysisPartyOrgService.processImport(this.formImport.value).subscribe(res => {
        if (res.type !== 'SUCCESS') {
          if (res.data != this.formImport.get('year').value) {
            this.dataError = res.data;
          }
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
    this.formImport.controls['fileImport'].clearValidators();
    this.formImport.controls['fileImport'].updateValueAndValidity();
    if (!CommonUtils.isValidForm(this.formImport)) {
      return;
    }
    const params = this.formImport.value;
    delete params['fileImport'];
    this.qualityAnalysisPartyOrgService.downloadTemplateImport(params).subscribe(res => {
      saveAs(res, 'template_quality_analysis_party_org.xls');
    });
    this.formImport.controls['fileImport'].setValidators(ValidationService.required);
  }

  public goBack() {
    this.router.navigate(['/party-organization/quality-analysis-party-organization']);
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
