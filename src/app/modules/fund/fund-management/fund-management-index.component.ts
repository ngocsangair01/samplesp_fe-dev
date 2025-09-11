import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'fund-management',
  templateUrl: './fund-management-index.component.html',
})
export class FundManagementComponent extends BaseComponent implements OnInit {
  constructor() {
    super(null, CommonUtils.getPermissionCode("resource.fundManagement"));
  }
  ngOnInit() {
  }
}