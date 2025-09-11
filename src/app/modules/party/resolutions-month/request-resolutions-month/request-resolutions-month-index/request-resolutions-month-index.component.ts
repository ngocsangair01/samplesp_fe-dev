import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'request-resolutions-month-index',
  templateUrl: './request-resolutions-month-index.component.html',
})
export class RequestResolutionsMonthIndexComponent extends BaseComponent implements OnInit {

  constructor() {
    super(null, CommonUtils.getPermissionCode("resource.requestResolutionMonth"))
  }

  ngOnInit() {
  }

}
