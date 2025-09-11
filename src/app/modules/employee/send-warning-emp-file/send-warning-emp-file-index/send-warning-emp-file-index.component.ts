import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'send-warning-emp-file-index',
  templateUrl: './send-warning-emp-file-index.component.html',
})
export class SendWarningEmpFileIndexComponent extends BaseComponent implements OnInit {

  constructor() {
    super(null, CommonUtils.getPermissionCode("resource.employeeManager"))
  }

  ngOnInit() {
  }

}
