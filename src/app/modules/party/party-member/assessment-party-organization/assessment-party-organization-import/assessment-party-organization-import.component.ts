import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from '@app/app.component';
import { FileControl } from '@app/core/models/file.control';
import { AssessmentPartyOrganizationService } from '@app/core/services/assessment-party-organization/assessment-party-organization.service';
// import _ from "lodash"

@Component({
  selector: 'assessment-party-organization-import',
  templateUrl: './assessment-party-organization-import.component.html',
  styleUrls: ['./assessment-party-organization-import.component.css']
})
export class AssessmentPartyOrganizationImportComponent extends BaseComponent implements OnInit {
  formImport: FormGroup;
  assessmentPartyOrganizationId: number;
  public dataError: any;
  isMobileScreen: boolean = false;
  formConfig = {
    assessmentPartyOrganizationId: ['', ValidationService.required],
    partyOrganizationId: [''],
    assessmentPeriodName: [''],
    assessmentLevelName: ['']
  };
  constructor(
    public activeModal: NgbActiveModal,
    public assessmentPartyOrganizationService: AssessmentPartyOrganizationService,
    public app: AppComponent
  ) {
    super(null, CommonUtils.getPermissionCode("resource.assessmentPartyOrganization"));
    this.setMainService(assessmentPartyOrganizationService)
    this.buildForms({});
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
  }

  ngOnInit() {
  }

  get f() {
    return this.formImport.controls;
  }

  setFormValue(assessmentPartyOrganizationId) {
    this.assessmentPartyOrganizationId = assessmentPartyOrganizationId;
    this.assessmentPartyOrganizationService.getInfo(assessmentPartyOrganizationId)
      .subscribe(res => {
        if (this.assessmentPartyOrganizationService.requestIsSuccess(res)) {
          this.buildForms(res.data)
        }
      })
  }

  processDownloadTemplate() {
    this.assessmentPartyOrganizationService.downloadTemplateImport(this.assessmentPartyOrganizationId).subscribe(res => {
      saveAs(res, 'assessment_party_organization_template.xlsx');
    });
  }

  processImport() {
    if (!CommonUtils.isValidForm(this.formImport)) {
      return;
    }
    this.app.confirmMessage(null, () => {// on accepted
      this.assessmentPartyOrganizationService.processImport(this.formImport.value).subscribe(res => {
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
