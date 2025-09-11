import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'mass-criteria-response-index',
  templateUrl: './mass-criteria-response-index.component.html'
})
export class MassCriteriaResponseIndexComponent extends BaseComponent implements OnInit {

  constructor() {
    super(null, CommonUtils.getPermissionCode("resource.massRequestCriteria"));
  }

  ngOnInit() {
  }

}
