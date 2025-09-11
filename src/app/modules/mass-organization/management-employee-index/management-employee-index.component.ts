import { BaseComponent } from './../../../shared/components/base-component/base-component.component';
import { Component, OnInit } from '@angular/core';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'management-employee-index',
  templateUrl: './management-employee-index.component.html',
  styleUrls: ['./management-employee-index.component.css']
})
export class ManagementEmployeeIndexComponent extends BaseComponent implements OnInit {

  constructor() {
    super(null, CommonUtils.getPermissionCode("resource.massMember"));
   }

  ngOnInit() {
  }

}
