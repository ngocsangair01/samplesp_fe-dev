import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
@Component({
  selector: 'response-policy-program-index',
  templateUrl: './response-policy-program-index.component.html',
})
export class ResponsePolicyProgramIndexComponent extends BaseComponent implements OnInit {

  constructor() {
    super(null, CommonUtils.getPermissionCode("resource.requestPolicyProgram"));
  }

  ngOnInit() {
  }

}
