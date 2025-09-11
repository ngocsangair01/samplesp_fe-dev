import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { ActivatedRoute } from '@angular/router';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'management-vertical-index',
  templateUrl: './management-vertical-index.component.html'
})
export class ManagementVerticalIndexComponent extends BaseComponent implements OnInit {

  constructor(
    public actr: ActivatedRoute
  ) {
    super(actr, CommonUtils.getPermissionCode("resource.empManagementVertical"));
  }

  ngOnInit() {
  }

}
