import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'request-policy-program-index',
  templateUrl: './request-policy-program-index.component.html',
})
export class RequestPolicyProgramIndexComponent extends BaseComponent implements OnInit {

  constructor() {
    super(null, CommonUtils.getPermissionCode("resource.requestPolicyProgram"));
  }

  ngOnInit() {
  }

}
