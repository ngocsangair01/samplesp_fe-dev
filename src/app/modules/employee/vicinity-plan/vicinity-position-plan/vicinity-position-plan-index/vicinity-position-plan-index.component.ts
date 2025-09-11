import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'vicinity-position-plan-index',
  templateUrl: './vicinity-position-plan-index.component.html'
})
export class VicinityPositionPlanIndexComponent extends BaseComponent implements OnInit {

  constructor() {
    super(null, CommonUtils.getPermissionCode("resource.employeeManager"));
  }

  ngOnInit() {
  }

}
