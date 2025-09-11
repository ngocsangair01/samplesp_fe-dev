import { AssessmentResultService } from './../../../../../core/services/employee/assessment-result.service';
import { FormGroup } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonUtils, ValidationService } from '@app/shared/services';

@Component({
  selector: 'assessment-evaluate-employee-again',
  templateUrl: './assessment-evaluate-employee-again.component.html',
  styleUrls: ['./assessment-evaluate-employee-again.component.css']
})
export class AssessmentEvaluateEmployeeAgainComponent extends BaseComponent implements OnInit {
  @Input() public isNewTheme: boolean = false;
  formAssessmentLevel: FormGroup
  assessmentResultId: number
  formConfig={
    assessmentLevelId: ['', ValidationService.required],
    assessmentResultId: [''],
    evaluatingLevel: [''],
    assessmentOrder: [''],
    reason: ['', [ValidationService.required, ValidationService.maxLength(500)]],
    employeeId:[''],
    assessmentPeriodId:['']
  }
  assessmentLevelList: any
  isMobileScreen: boolean = false;
  constructor(
    public activeModal: NgbActiveModal,
    private assessmentResultService: AssessmentResultService
  ) {
    super(null)
    this.setMainService(assessmentResultService)
    this.formAssessmentLevel = this.buildForm({}, this.formConfig)
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
  }
  setData(formRequest: any) {
    this.assessmentResultId = formRequest.assessmentResultId
    this.formAssessmentLevel.controls['employeeId'].setValue(formRequest.employeeId)
    this.formAssessmentLevel.controls['assessmentPeriodId'].setValue(formRequest.assessmentPeriodId)
    this.formAssessmentLevel.controls['assessmentOrder'].setValue(formRequest.assessmentOrder)
    // get assessmentLevelList
    this.assessmentResultService.getAssessmentLevelListV2(formRequest).subscribe(res => {
      if (res.data && res.data instanceof Array && res.data.length === 1) {
        this.formAssessmentLevel.controls['assessmentLevelId'].setValue(res.data[0].assessmentLevelId);
      }
      this.assessmentLevelList = res.data;
    })
  }
  ngOnInit() {
  }
  get f() {
    return this.formAssessmentLevel.controls
  }

  public processEvaluateAgain() {
    if(!CommonUtils.isValidForm(this.formAssessmentLevel)) {
      return
    }
    // call api and back to list
    let evaluatingLevel = null
    let assessmentOrder = 1
    const assessmentLevelId = this.formAssessmentLevel.value.assessmentLevelId
    if(this.assessmentLevelList && this.assessmentLevelList.length > 0) {
      let index = this.assessmentLevelList.findIndex(item => item.assessmentLevelId === assessmentLevelId);
      if(index > 0) {
        evaluatingLevel = this.assessmentLevelList[index].assessmentOrder
        assessmentOrder = this.assessmentLevelList[index].assessmentOrder
      }
    }
    this.formAssessmentLevel.controls['assessmentResultId'].setValue(this.assessmentResultId)
    this.formAssessmentLevel.controls['evaluatingLevel'].setValue(evaluatingLevel);
    this.formAssessmentLevel.controls['assessmentOrder'].setValue(assessmentOrder)
    this.assessmentResultService.reEvaluation(this.formAssessmentLevel.value)
      .subscribe(res => {
        if (this.assessmentResultService.requestIsSuccess(res)) {
          this.activeModal.close(res.data);
        }
      });
  }
}
