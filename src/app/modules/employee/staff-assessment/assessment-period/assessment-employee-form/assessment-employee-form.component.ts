import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { FormGroup, FormControl } from '@angular/forms';
import { AssessmentPeriodService } from '@app/core/services/assessmentPeriod/assessment-period.service';
import { APP_CONSTANTS } from '@app/core';
import { AppComponent } from '@app/app.component';
import {CurriculumVitaeService} from "@app/core/services/employee/curriculum-vitae.service";

@Component({
  selector: 'assessment-employee-form',
  templateUrl: './assessment-employee-form.component.html'
})
export class AssessmentEmployeeFormComponent extends BaseComponent implements OnInit {
  formSave: FormGroup;
  formConfig = {
    assessmentPeriodId: [''],
    employeeId: ['', ValidationService.required],
    partyOrganizationId: ['']
  };
  assessmentPeriodName = '';
  empFilterCondition = ' AND obj.status = 1 ';
  
  constructor(
    public activeModal: NgbActiveModal,
    private assessmentPeriodService: AssessmentPeriodService,
    private curriculumVitaeService: CurriculumVitaeService,
    private app: AppComponent
  ) {
    super(null, CommonUtils.getPermissionCode('resource.assessmentPeriod'));
    this.formSave = this.buildForm({}, this.formConfig);
  }

  ngOnInit() {
  }

  setFormValue(data) {
    if (data) {
      // get periodList da ban hanh
      this.assessmentPeriodService.findOne(data.assessmentPeriodId).subscribe(res => {
        this.assessmentPeriodName = res.data.assessmentPeriodName;
        this.formSave  = this.buildForm(data, this.formConfig);
      })
    }
  }

  get f() {
    return this.formSave.controls;
  }

  processSave() {
    if (!CommonUtils.isValidForm(this.formSave)) {
      return;
    }
    this.curriculumVitaeService.getEmployeeInfoById(this.formSave.value.employeeId).subscribe(res=>{
      this.formSave.controls["partyOrganizationId"].setValue(res.data.partyOrganizationId);
      this.assessmentPeriodService.processAddStaffAssessment(this.formSave.value).subscribe(res => {
        if (this.assessmentPeriodService.requestIsSuccess(res)) {
          this.activeModal.close(res);
        }
      })
    })

  }

  cancel() {
    this.activeModal.close();
  }

}
