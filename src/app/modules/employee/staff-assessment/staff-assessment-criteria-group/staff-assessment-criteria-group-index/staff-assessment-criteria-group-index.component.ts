import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';

@Component({
  selector: 'staff-assessment-criteria-group-index',
  templateUrl: './staff-assessment-criteria-group-index.component.html'
})
export class StaffAssessmentCriteriaGroupIndexComponent extends BaseComponent implements OnInit {

  constructor() {
    super(null, 'ASSESSMENT_CRITERIA_GROUP');
  }

  ngOnInit() {
  }

}
