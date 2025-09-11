import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'mass-request-index',
  templateUrl: './mass-request-index.component.html'
})
export class MassRequestIndexComponent extends BaseComponent implements OnInit {

  constructor() {
    super(null, CommonUtils.getPermissionCode("resource.massRequestCriteria"));
   }

  ngOnInit() {
  }

}
