import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'fund-activity',
  templateUrl: './fund-activity-index.component.html',
})
export class FundActivityComponent extends BaseComponent implements OnInit {
  constructor() {
    super(null, CommonUtils.getPermissionCode("resource.fundActivity"));
  }
  ngOnInit() {
  }
}