import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'resolution-quarter-year-index',
  templateUrl: './resolution-quarter-year-index.component.html'
})
export class ResolutionQuarterYearIndexComponent extends BaseComponent implements OnInit {

  constructor() {
    super(null, CommonUtils.getPermissionCode("resource.requestResolutionQuarterYear"));
  }

  ngOnInit() {
  }

}
