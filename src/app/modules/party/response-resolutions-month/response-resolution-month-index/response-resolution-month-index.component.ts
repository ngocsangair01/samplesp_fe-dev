import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'response-resolution-month-index',
  templateUrl: './response-resolution-month-index.component.html',
})
export class ResponseResolutionMonthIndexComponent extends BaseComponent implements OnInit {

  constructor() {
    super(null, CommonUtils.getPermissionCode("resource.requestResolutionMonth"));
  }

  ngOnInit() {
  }

}
