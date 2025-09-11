import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'group-org-position-index',
  templateUrl: './group-org-position-index.component.html',

})
export class GroupOrgPositionIndexComponent extends BaseComponent implements OnInit {

  constructor() {
    super(null, CommonUtils.getPermissionCode("resource.groupOrgPosition"));
  }

  ngOnInit() {
  }

}
