import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'emp-file-index',
  templateUrl: './emp-file-index.component.html',
})
export class EmpFileIndexComponent extends BaseComponent implements OnInit {

  constructor() {
    super(null, CommonUtils.getPermissionCode("resource.empFile"));
  }

  ngOnInit() {
  }

}
