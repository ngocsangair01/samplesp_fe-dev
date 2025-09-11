import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'subsidized-period-index',
  templateUrl: './subsidized-period-index.component.html'
})
export class SubsidizedPeriodIndexComponent extends BaseComponent implements OnInit {

  constructor() {
    super(null, CommonUtils.getPermissionCode("resource.subsidized"))
  }

  ngOnInit() {
  }

}
