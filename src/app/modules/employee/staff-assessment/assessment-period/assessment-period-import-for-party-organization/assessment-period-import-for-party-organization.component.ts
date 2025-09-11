import { AssessmentPeriodService } from '@app/core/services/assessmentPeriod/assessment-period.service';
import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { FormGroup } from '@angular/forms';
import { ValidationService, CommonUtils } from '@app/shared/services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from '@app/app.component';

@Component({
  selector: 'assessment-period-import-for-party-organization',
  templateUrl: './assessment-period-import-for-party-organization.component.html'
})
export class AssessmentPeriodImportForPartyOrganizationComponent extends BaseComponent implements OnInit {
  formImport: FormGroup;
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
    this.formImport = this.buildForm({}, this.formConfig);
  }

  ngOnInit() {
  }

  /**
   * Build new form with request data
   * @param assessmentPeriodId requrest param
   */
  setFormValue(assessmentPeriodId: number) {
    this.assessmentPeriodId = assessmentPeriodId;
    this.formImport = this.buildForm({assessmentPeriodId: assessmentPeriodId}, this.formConfig);
  }

  get f() {
    return this.formImport.controls;
  }

  /**
   * Process active make list for party organization
   */
  processImport() {
    if (!CommonUtils.isValidForm(this.formImport)) {
      return;
    }
    this.assessmentPeriodService.findOne(this.assessmentPeriodId).subscribe(res => {
      if (res.data.status == 1) {
        this.app.warningMessage('assessmentPeriod.import.validate');
      } else {
        this.app.confirmMessage('assessmentPartyOrg.import.messageConfirm', () => { // on accepted
          this.assessmentPeriodService.makeListForPartyOrganization(this.formImport.value).subscribe(res => {
            if (this.assessmentPeriodService.requestIsSuccess(res)) {
              this.activeModal.close();
            }
          })
        }, () => {});
      }})
  }

  /**
   * close model import
   */
  cancel() {
    this.activeModal.close();
  }

}
