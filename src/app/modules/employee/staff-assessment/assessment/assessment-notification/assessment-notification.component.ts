import { FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AssessmentResultService } from '@app/core/services/employee/assessment-result.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'assessment-notification',
  templateUrl: './assessment-notification.component.html'
})
export class AssessmentNotificationComponent extends BaseComponent implements OnInit {
  formNotification: FormGroup;
  formConfig={
    notificationContent: ['', Validators.required],
    assessmentPeriodId: ['', Validators.required],
    employeeId: ['', Validators.required]
  }
  constructor(
    public activeModal: NgbActiveModal,
    private assessmentResultService: AssessmentResultService
  ) {
    super(null)
    this.setMainService(assessmentResultService)
    this.formNotification = this.buildForm({}, this.formConfig);
  }

  ngOnInit() {
  }

  setData(assessmentPeriodId: number, employeeId: number) {
    this.formNotification.controls['assessmentPeriodId'].setValue(assessmentPeriodId)
    this.formNotification.controls['employeeId'].setValue(employeeId)
  }

  get f() {
    return this.formNotification.controls;
  }

  processSendNotification() {
    if(!CommonUtils.isValidForm(this.formNotification)) {
      return;
    }
    this.assessmentResultService.sendNotification(this.formNotification.value).subscribe(res => {
      if (this.assessmentResultService.requestIsSuccess(res)) {
        this.activeModal.close(res);
      }
    })
  }
}
