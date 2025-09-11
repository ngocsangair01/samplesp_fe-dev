import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';

@Component({
  selector: 'staff-assessment-criteria-index',
  templateUrl: './staff-assessment-criteria-index.component.html'
})
export class StaffAssessmentCriteriaIndexComponent extends BaseComponent implements OnInit {

  constructor() {
    super(null, 'ASSESSMENT_CRITERIA');
  }

  ngOnInit() {
  }

}
