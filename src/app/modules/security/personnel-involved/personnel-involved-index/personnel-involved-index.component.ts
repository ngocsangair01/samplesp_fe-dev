import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'personnel-involved-index',
  templateUrl: './personnel-involved-index.component.html',
  styleUrls: ['./personnel-involved-index.component.css']
})
export class PersonnelInvolvedIndexComponent extends BaseComponent implements OnInit {

  constructor() {
    super(null, CommonUtils.getPermissionCode("resource.securityProtection"));
  }

  ngOnInit() {
  }

}
