import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'subsidized-info-index',
  templateUrl: './subsidized-info-index.component.html'
})
export class SubsidizedInfoIndexComponent extends BaseComponent implements OnInit {

  constructor() {
    super(null, CommonUtils.getPermissionCode("resource.subsidized"))
  }

  ngOnInit() {
  }

}
