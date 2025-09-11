import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';

@Component({
  selector: 'assessment-period-index',
  templateUrl: './assessment-period-index.component.html'
})
export class AssessmentPeriodIndexComponent extends BaseComponent implements OnInit {

  constructor() {
    super(null,'ASSESSMENT_PERIOD');
  }

  ngOnInit() {
  }

}
