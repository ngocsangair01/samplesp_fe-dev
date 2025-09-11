import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from '@app/app.component';
import { FileControl } from '@app/core/models/file.control';
import { AssessmentPartySignerService } from '@app/core/services/assessment-party-signer/assessment-party-signer.service';
import { AssessmentPartyOrganizationService } from '@app/core/services/assessment-party-organization/assessment-party-organization.service';
// import _ from "lodash"

@Component({
  selector: 'assessment-party-signer-import',
  templateUrl: './assessment-party-signer-import.component.html'
})
export class AssessmentPartySignerImportComponent extends BaseComponent implements OnInit {
  formImport: FormGroup;
  assessmentPartySignerId: number;
  public dataError: any;
  formConfig = {
    assessmentPartySignerId: ['', ValidationService.required],
    assessmentPeriodName: [''],
    assessmentLevelName: ['']
  };
  constructor(
    public activeModal: NgbActiveModal,
    public assessmentPartySignerService: AssessmentPartySignerService,
    public app: AppComponent
  ) {
    super(null, CommonUtils.getPermissionCode("resource.assessmentLevelPartyOrganization"));
    this.setMainService(assessmentPartySignerService)
    this.buildForms({});
  }

  ngOnInit() {
  }

  get f() {
    return this.formImport.controls;
  }

  setFormValue(assessmentPartySignerId) {
    this.assessmentPartySignerId = assessmentPartySignerId;
    this.assessmentPartySignerService.getInfo(assessmentPartySignerId)
      .subscribe(res => {
        if (this.assessmentPartySignerService.requestIsSuccess(res)) {
          this.buildForms(res.data)
        }
      })
  }

  processDownloadTemplate() {
    this.assessmentPartySignerService.downloadTemplateImport(this.assessmentPartySignerId).subscribe(res => {
      saveAs(res, 'assessment_party_signer_template.xlsx');
    });
  }

  processImport() {
    if (!CommonUtils.isValidForm(this.formImport)) {
      return;
    }
    this.app.confirmMessage(null, () => {// on accepted
      this.assessmentPartySignerService.processImport(this.formImport.value).subscribe(res => {
        if (res.type === 'WARNING') {
          this.dataError = res.data;
        } else if (res.type === 'ERROR') {
          this.dataError = null;
        } else if (res.type === 'SUCCESS') {
          this.dataError = null;
          this.activeModal.close(res);
        }
      });
    }, () => {
      // on rejected
    });
  }

  buildForms(data) {
    this.formImport = this.buildForm(data, this.formConfig);
    this.formImport.addControl('fileImport', new FileControl(null, ValidationService.required));
  }

  cancel() {
    this.activeModal.close();
  }
}
