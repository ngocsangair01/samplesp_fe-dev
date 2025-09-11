import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'subsidized-result-index',
  templateUrl: './subsidized-result-index.component.html'
})
export class SubsidizedResultIndexComponent extends BaseComponent implements OnInit {

  constructor() {
    super(null, CommonUtils.getPermissionCode("resource.subsidized"))
  }

  ngOnInit() {
  }
}
