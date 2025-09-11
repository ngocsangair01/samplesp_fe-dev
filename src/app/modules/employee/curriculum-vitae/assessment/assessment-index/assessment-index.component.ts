import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'assessment-index',
  templateUrl: './assessment-index.component.html',
})
export class AssessmentIndexComponent extends BaseComponent implements OnInit {

  constructor() {
    super(null, CommonUtils.getPermissionCode("resource.employeeManager"));
  }

  ngOnInit() {
  }

}
