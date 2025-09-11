import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'transfer-employee-index',
  templateUrl: './transfer-employee-index.component.html',
})
export class TransferEmployeeIndexComponent extends BaseComponent implements OnInit {

  constructor() {
    super(null, CommonUtils.getPermissionCode("resource.transferEmployee"));
  }

  ngOnInit() {
  }

}
