import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'emp-type-process-index',
  templateUrl: './emp-type-process-index.component.html',
})
export class EmpTypeProcessIndexComponent extends BaseComponent implements OnInit {

  constructor() {
    super(null, CommonUtils.getPermissionCode("resource.empTypeProcess"));
  }

  ngOnInit() {
  }

}
