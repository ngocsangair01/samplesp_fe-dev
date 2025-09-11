import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'personnel-key-index',
  templateUrl: './personnel-key-index.component.html',
})
export class PersonnelKeyIndexComponent extends BaseComponent implements OnInit {

  constructor() {
    // super(null, CommonUtils.getPermissionCode("resource.personnelKey"))
    super()
  }

  ngOnInit() {
  }

}
