import { AssessmentPartyOrganizationService } from '@app/core/services/assessment-party-organization/assessment-party-organization.service';
import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup } from '@angular/forms';
import { AppComponent } from '@app/app.component';

@Component({
  selector: 'assessment-request-again',
  templateUrl: './assessment-request-again.component.html',
  styleUrls: ['./assessment-request-again.component.css']
})
export class AssessmentRequestAgainComponent extends BaseComponent implements OnInit {
  formSave: FormGroup;
  isMobileScreen: boolean = false;
  formConfig = {
    assessmentPartyOrganizationId: ['', [ValidationService.required]],
    partyOrganizationId: ['', [ValidationService.required]],
    assessmentPeriodId: ['', [ValidationService.required]],
    assessmentPeriodName: ['', [ValidationService.required]],
    assessmentLevelOrderName: ['', [ValidationService.required]],
    reason: ['', [ValidationService.required]],
    signDocumentId: ['', [ValidationService.required]],
    signType: ['assessment-party-organization']
  }
  constructor(
    public activeModal: NgbActiveModal,
    public assessmentPartyOrganizationService: AssessmentPartyOrganizationService,
    public app: AppComponent
  ) {
    super(null, CommonUtils.getPermissionCode("resource.assessmentPartyOrganization"));
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
  }

  ngOnInit() {

  }

  get f() {
    return this.formSave.controls;
  }

  setFormValue(item) {
    this.formSave = this.buildForm(item, this.formConfig);
  }

  public processRequestAssessmentAgain() {
    if (!CommonUtils.isValidForm(this.formSave)) {
      return;
    }
    this.app.confirmMessage('assessmentPartyOrganization.message.assessmentAgain', () => {
      this.assessmentPartyOrganizationService.processAssessmentRequestAgain(this.formSave.value).subscribe(res => {
        if (this.assessmentPartyOrganizationService.requestIsSuccess(res)) {
          this.activeModal.close(res);
        }
      })
    }, () => {})
  }

}
