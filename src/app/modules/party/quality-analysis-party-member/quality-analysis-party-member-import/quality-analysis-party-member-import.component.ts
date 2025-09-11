import { Component, OnInit } from '@angular/core';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { FileControl } from '@app/core/models/file.control';
import { QualityAnalysisPartyMemberService } from '@app/core/services/party-organization/quality-analysis-party-member.service';
import { TranslationService } from 'angular-l10n';
import { AppComponent } from '@app/app.component';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import * as moment from 'moment';

@Component({
  selector: 'quality-analysis-party-member-import',
  templateUrl: './quality-analysis-party-member-import.component.html'
})
export class QualityAnalysisPartyMemberImportComponent extends BaseComponent implements OnInit {

  formImport: FormGroup;
  formConfig = {
    partyOrganizationId: ['', [ValidationService.required]],
    year: [parseInt(moment(new Date()).format('YYYY')), [ValidationService.required]],
    importDate: [moment(new Date()).startOf('day').toDate().getTime(), [ValidationService.required]],
    content: ['', [ValidationService.maxLength(1000)]]
  };
  public listYear: any;
  public listQualityRating: any;

  public dataError: any;
  constructor(private qualityAnalysisPartyMemberService: QualityAnalysisPartyMemberService,
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
      this.qualityAnalysisPartyMemberService.processImport(this.formImport.value)
        .subscribe(res => {
          if (res.type == 'SUCCESS') {
            this.dataError = null;
            this.goBack();
          } else if (res.type == 'ERROR') {
            this.dataError = res.data;
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
    this.qualityAnalysisPartyMemberService.downloadTemplateImport(params).subscribe(res => {
      saveAs(res, 'template_quality_analysis_party_member.xls');
    });
    this.formImport.controls['fileImport'].setValidators(ValidationService.required);
  }

  public goBack() {
    this.router.navigate(['/party-organization/quality-analysis-party-member']);
  }

}
