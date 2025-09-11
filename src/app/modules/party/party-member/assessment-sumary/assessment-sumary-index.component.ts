import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'assessment-sumary-index',
  templateUrl: './assessment-sumary-index.component.html'
})
export class AssessmentSumaryIndexComponent extends BaseComponent implements OnInit {
  constructor(
  ) {
    super(null, CommonUtils.getPermissionCode("resource.assessmentSumary"))
  }

  ngOnInit() {
  }
}
