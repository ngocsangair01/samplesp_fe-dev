import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { Component, OnInit } from '@angular/core';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'import-response-policy-program-index',
  templateUrl: './import-response-policy-program-index.component.html'
})
export class ImportResponsePolicyProgramIndexComponent extends BaseComponent implements OnInit {

  constructor() { 
    super(null, CommonUtils.getPermissionCode("resource.requestPolicyProgram"));
  }

  ngOnInit() {
  }

}
