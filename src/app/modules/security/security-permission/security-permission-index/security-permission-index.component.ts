import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'security-permission-index',
  templateUrl: './security-permission-index.component.html',
})
export class SecurityPermissionIndexComponent extends BaseComponent implements OnInit {

  constructor() {
    super(null, CommonUtils.getPermissionCode("resource.securityProtection"));
  }

  ngOnInit() {
  }

}
