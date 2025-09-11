import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StaffAssessmentCriteriaService } from '@app/core/services/employee/staff-assessment-criteria.service';

@Component({
  selector: 'list-staff-assessment-criteria',
  templateUrl: './list-staff-assessment-criteria.component.html'
})
export class ListStaffAssessmentCriteriaComponent extends BaseComponent implements OnInit {
  resultList: any;
  assessmentCriteriaGroupCode: string
  assessmentCriteriaGroupName: string
  formConfig = {
    assessmentCriteriaGroupId: ['']
  }
  constructor(
    private staffAssessmentCriteriaService: StaffAssessmentCriteriaService,
    public activeModal: NgbActiveModal,
  ) {
    super(null, 'ASSESSMENT_CRITERIA_GROUP');
    this.setMainService(staffAssessmentCriteriaService);
    this.buildForms({});
   }

  ngOnInit() {
    // this.processSearch();
  }

   /**
   * buildForm
   */
  private buildForms(data?: any): void {
    this.formSearch = this.buildForm(data, this.formConfig);
  }
  get f () {
    return this.formSearch.controls;
  }

  
  setFormValue(assessmentCriteriaGroupId: any, assessmentCriteriaGroupCode: any, assessmentCriteriaGroupName: any) {
    this.assessmentCriteriaGroupCode = assessmentCriteriaGroupCode
    this.assessmentCriteriaGroupName = assessmentCriteriaGroupName
    // this.formSearch.controls["assessmentCriteriaGroupCode"].setValue(assessmentCriteriaGroupCode);
    // this.formSearch.controls["assessmentCriteriaGroupName"].setValue(assessmentCriteriaGroupName);
    this.formSearch.controls["assessmentCriteriaGroupId"].setValue(assessmentCriteriaGroupId);
    if (assessmentCriteriaGroupId && assessmentCriteriaGroupId > 0) {
      this.processSearch();
    }
  }
}
