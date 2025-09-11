import { AssessmentPeriodService } from '@app/core/services/assessmentPeriod/assessment-period.service';
import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { FormGroup } from '@angular/forms';
import { ValidationService, CommonUtils } from '@app/shared/services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from '@app/app.component';

@Component({
  selector: 'assessment-period-delete-by-party-organization',
  templateUrl: './assessment-period-delete-by-party-organization.component.html'
})
export class AssessmentPeriodDeleteByPartyOrganizationComponent extends BaseComponent implements OnInit {
  formDelete: FormGroup;
  formConfig = {
    assessmentPeriodId: ['', ValidationService.required],
    partyOrganizationId: ['', ValidationService.required]
  }
  assessmentPeriodId:any;
  constructor(
    private assessmentPeriodService: AssessmentPeriodService,
    public activeModal: NgbActiveModal,
    public app: AppComponent
  ) {
    super(null, 'ASSESSMENT_PERIOD');
    this.setMainService(assessmentPeriodService);
    this.formDelete = this.buildForm({}, this.formConfig);
  }

  ngOnInit() {
  }

  /**
   * Build new form with request data
   * @param assessmentPeriodId requrest param
   */
  setFormValue(assessmentPeriodId: number) {
    this.assessmentPeriodId = assessmentPeriodId;
    this.formDelete = this.buildForm({assessmentPeriodId: assessmentPeriodId}, this.formConfig);
  }

  get f() {
    return this.formDelete.controls;
  }

  /**
   * Xoa can bo danh gia theo TCD da chon
   */
  processDelete() {
    if (!CommonUtils.isValidForm(this.formDelete)) {
      return;
    }
    this.app.confirmMessage('assessmentPartyOrg.delete.messageConfirm', () => { // on accepted
      this.assessmentPeriodService.deleteAssessmentEmpByPartyOrganization(this.formDelete.value).subscribe(res => {
        if (this.assessmentPeriodService.requestIsSuccess(res)) {
          this.activeModal.close();
        }
      });
    }, () => {
    });
  }

  /**
   * close model import
   */
  cancel() {
    this.activeModal.close();
  }

}
