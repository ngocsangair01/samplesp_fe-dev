import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'emp-army-proposed-system-index',
  templateUrl: './emp-army-proposed-system-index.component.html',

})
export class EmpArmyProposedSystemIndexComponent extends BaseComponent implements OnInit {

  constructor() {
    super(null, CommonUtils.getPermissionCode("resource.empArmyProposedSystem"));

  }

  ngOnInit() {
  }

}





