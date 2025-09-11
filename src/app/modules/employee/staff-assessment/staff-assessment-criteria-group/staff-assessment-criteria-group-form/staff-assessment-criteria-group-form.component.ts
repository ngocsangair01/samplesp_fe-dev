import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { ValidationService, CommonUtils } from '@app/shared/services';
import { APP_CONSTANTS } from '@app/core';
import { StaffAssessmentCriteriaGroupService } from '@app/core/services/employee/staff-assessment-criteria-group.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from '@app/app.component';
import { Router } from '@angular/router';

@Component({
  selector: 'staff-assessment-criteria-group-form',
  templateUrl: './staff-assessment-criteria-group-form.component.html',
  styleUrls: ['./staff-assessment-criteria-group-form.component.css']
})
export class StaffAssessmentCriteriaGroupFormComponent extends BaseComponent implements OnInit {

  formSave: FormGroup;
  isEditMode: boolean = false;
  statusList = APP_CONSTANTS.SELECT_STAFF_ASSESSMENT_CRITERIA_GROUP_STATUS;
  assessmentCriteriaGroupTypeList = APP_CONSTANTS.SELECT_STAFF_ASSESSMENT_CRITERIA_GROUP_TYPE;
  formConfig = {
    assessmentCriteriaGroupId: ['',[ValidationService.maxLength(20)]],
    assessmentCriteriaGroupCode: ['',[ValidationService.required, ValidationService.maxLength(50)]],
    assessmentCriteriaGroupName: ['',[ValidationService.required, ValidationService.maxLength(500)]],
    assessmentCriteriaGroupStatus: ['',[ValidationService.required]],
    assessmentCriteriaGroupType: ['',[ValidationService.required]],
    description: ['', [ ValidationService.maxLength(1000)]],
  }
 
  constructor(
    public activeModal: NgbActiveModal,
    private app: AppComponent,
    private staffAssessmentCriteriaGroupService: StaffAssessmentCriteriaGroupService,
    private router: Router,
    
  ) {
    
    super(null, 'ASSESSMENT_CRITERIA_GROUP');
    this.buildForms({});
  }

  /**
   * buildForm
   */
  private buildForms(data?: any): void {
    this.formSave = this.buildForm(data, this.formConfig);
  }

  ngOnInit() {

  }
  get f () {
    return this.formSave.controls;
  }
  
  setFormValue(data) {
    if (data && data.assessmentCriteriaGroupId > 0) {
      if(data.assessmentCriteriaGroupStatus === APP_CONSTANTS.ASSESSMENT_CRITERIAGROUP_STATUS.NHAP ) {
        this.statusList = APP_CONSTANTS.SELECT_STAFF_ASSESSMENT_CRITERIA_GROUP_STATUS;
      } else {
        this.statusList = APP_CONSTANTS.SELECT_STAFF_ASSESSMENT_CRITERIA_GROUP_STATUS_2;
      }
      this.buildForms(data);
      this.isEditMode = true;
    } else {
      this.buildForms(data);
    }
  }
  public processUpdate() {
    if (!CommonUtils.isValidForm(this.formSave)) {
      return;
    }
    
    this.app.confirmMessage(null, () => { // on accepted
      this.staffAssessmentCriteriaGroupService.saveOrUpdate(this.formSave.value)
      .subscribe(res => {
        if (this.staffAssessmentCriteriaGroupService.requestIsSuccess(res)) {   
          this.activeModal.close(res);
        }
      });
      }, () => {
      // on rejected   
    });
  }

}
