import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';

@Component({
  selector: 'assessment-formula-index',
  templateUrl: './assessment-formula-index.component.html'
})
export class AssessmentFormulaIndexComponent extends BaseComponent implements OnInit {

  constructor() {
    super(null,"ASSESSMENT_FORMULA");
   }

  ngOnInit() {
  }

}
