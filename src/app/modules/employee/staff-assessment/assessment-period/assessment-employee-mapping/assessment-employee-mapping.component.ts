import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AssessmentPeriodService } from '@app/core/services/assessmentPeriod/assessment-period.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { APP_CONSTANTS } from '@app/core';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';

@Component({
  selector: 'assessment-employee-mapping',
  templateUrl: './assessment-employee-mapping.component.html'
})
export class AssessmentEmployeeMappingComponent extends BaseComponent implements OnInit {

  formUpdateStaffMappingAssessmentLevel: FormArray
  firstIndex: string
  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private assessmentPeriodService: AssessmentPeriodService,
    private router: Router,
    private app: AppComponent
  ) {
    super();
    this.setMainService(this.assessmentPeriodService)
    this.firstIndex = APP_CONSTANTS.ASSESSMENT_VALUE_DEFAULT.index;
   }

  ngOnInit() {
  }

  /**
   * get data from form component
   * @param data 
   */
  setDataList(data) {
    // get assessmentLevel for assessmentPeriodId
    this.assessmentPeriodService.getStaffMappingAssessmentLevelList(data).subscribe(res => {  
      this.buildFormUpdateStaffMappingAssessmentLevel(res)
    })
  }
  /**
   * build FormArray
   * @param assessmentLevelList 
   */
  private buildFormUpdateStaffMappingAssessmentLevel(assessmentLevelList): void {
      const controls = new FormArray([]);
      for (const emp of assessmentLevelList) {
        const group = this.makeDefaultAssessmentEmployeeMapping();
        group.patchValue(emp);
        controls.push(group);
      }
      this.formUpdateStaffMappingAssessmentLevel = controls;
  }

  /** 
   * Initial form assessment employee mapping
   */
  private makeDefaultAssessmentEmployeeMapping(): FormGroup {
    return this.formBuilder.group({
      assessmentEmployeeMappingId: [null],
      assessmentLevelId: [null],
      assessmentLevelName: [''],
      assessmentEmployeeId: [null],
      employeeId: [null]
    });
  }

  /**
   * process update AssessmentEmployeeMapping
   */
  public processUpdateAssessmentEmployeeMapping() {
    if (!CommonUtils.isValidForm(this.formUpdateStaffMappingAssessmentLevel)) {
      return;
    }
    this.app.confirmMessage(null, ()=> {
      this.assessmentPeriodService.updateAssessmentEmployeeMapping(this.formUpdateStaffMappingAssessmentLevel.value).subscribe(res =>{
        if (this.assessmentPeriodService.requestIsSuccess(res)) {
          this.activeModal.close(res);
        }
      })
    }, () => { // on rejected

    })
  }
}
