import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'vicinity-position-plan-index-clone',
  templateUrl: './vicinity-position-plan-index.component.html'
})
export class VicinityPositionPlanIndexCloneComponent extends BaseComponent implements OnInit {

  constructor() {
    super(null, CommonUtils.getPermissionCode("resource.employeeManager"));
  }

  ngOnInit() {
  }

}
