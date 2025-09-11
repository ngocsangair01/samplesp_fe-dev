import { Component, OnInit, ViewChildren } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { FileControl } from '@app/core/models/file.control';
import { AssessmentSumaryService } from '@app/core/services/assessment-sumary/assessment-sumary.service';
import { PartyMemebersService } from '@app/core/services/party-organization/party-members.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { TranslationService } from 'angular-l10n';

@Component({
  selector: 'assessment-sumary-form-import',
  templateUrl: './assessment-sumary-form-import.component.html'
})
export class AssessmentSumaryFormImportComponent extends BaseComponent implements OnInit {

  public formImport: FormGroup;
  public dataError: any;

  constructor(private assessmentSumaryService: AssessmentSumaryService,
    private app: AppComponent,
    private router: Router) {
    super(null, CommonUtils.getPermissionCode("resource.assessmentSumary"));
    this.formImport = this.buildForm({}, {});
    this.formImport.addControl('fileImport', new FileControl(null, ValidationService.required));
    this.formImport.addControl('fileAssessmentSumary', new FileControl(null));
  }

  ngOnInit() {
  }

  get f() {
    return this.formImport.controls;
  }

  processImport() {
    this.formImport.controls['fileImport'].updateValueAndValidity();
    this.formImport.controls['fileAssessmentSumary'].updateValueAndValidity();
    if (!CommonUtils.isValidForm(this.formImport)) {
      return;
    }
    this.app.confirmMessage(null, () => {// on accepted
      this.assessmentSumaryService.processImport(this.formImport.value).subscribe(res => {
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
    this.formImport.controls['fileImport'].clearValidators();
    this.formImport.controls['fileImport'].updateValueAndValidity();
    this.formImport.controls['fileAssessmentSumary'].clearValidators();
    this.formImport.controls['fileAssessmentSumary'].updateValueAndValidity();
    if (!CommonUtils.isValidForm(this.formImport)) {
      return;
    }
    const params = this.formImport.value;
    delete params['fileImport'];
    delete params['fileAssessmentSumary'];
    this.assessmentSumaryService.downloadTemplateImport(params).subscribe(res => {
      saveAs(res, 'template_assessment_sumary.xls');
    });
    this.formImport.controls['fileImport'].setValidators(ValidationService.required);
  }

   /**
   * goBack
   */
  public goBack() {
    this.router.navigate(['/party-organization/assessment-sumary']);
  }
}
