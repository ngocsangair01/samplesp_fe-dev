import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'config-army-condition-index',
  templateUrl: './config-army-condition-index.component.html',

})
export class ConfigArmyConditionIndexComponent extends BaseComponent implements OnInit {

  constructor() {
    super(null, CommonUtils.getPermissionCode("resource.configArmyCondition"));

  }

  ngOnInit() {
  }

}





