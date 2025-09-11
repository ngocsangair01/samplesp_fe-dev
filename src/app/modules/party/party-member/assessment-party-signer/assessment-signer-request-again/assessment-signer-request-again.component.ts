import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup } from '@angular/forms';
import { AppComponent } from '@app/app.component';
import { AssessmentPartySignerService } from '@app/core/services/assessment-party-signer/assessment-party-signer.service';

@Component({
  selector: 'assessment-signer-request-again',
  templateUrl: './assessment-signer-request-again.component.html'
})
export class AssessmentSignerRequestAgainComponent extends BaseComponent implements OnInit {
  formSave: FormGroup;
  formConfig = {
    assessmentPartyOrganizationId: ['', [ValidationService.required]],
    partyOrganizationId: ['', [ValidationService.required]],
    assessmentPeriodId: ['', [ValidationService.required]],
    assessmentPeriodName: ['', [ValidationService.required]],
    assessmentLevelOrderName: ['', [ValidationService.required]],
    reason: ['', [ValidationService.required]],
    signDocumentId: ['', [ValidationService.required]],
    signType: ['assessment-party-signer']
  }
  constructor(
    public activeModal: NgbActiveModal,
    public assessmentPartySignerService: AssessmentPartySignerService,
    public app: AppComponent
  ) {
    super(null, CommonUtils.getPermissionCode("resource.assessmentLevelPartyOrganization"));
  }

  ngOnInit() {

  }

  get f() {
    return this.formSave.controls;
  }

  setFormValue(item) {
    this.formSave = this.buildForm(item, this.formConfig);
  }
  
}
