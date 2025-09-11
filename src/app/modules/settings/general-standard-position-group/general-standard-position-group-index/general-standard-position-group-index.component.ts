import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';


@Component({
  selector: 'general-standard-position-group-index',
  templateUrl: './general-standard-position-group-index.component.html',
})
export class GeneralStandardPositionGroupIndexComponent extends BaseComponent implements OnInit {

  constructor() {
    super(null, CommonUtils.getPermissionCode("resource.generalStandardPositionGroup"));
  }

  ngOnInit() {
  }

}
