import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'army-proposed-template-index',
  templateUrl: './army-proposed-template-index.component.html',

})
export class ArmyProposedTemplateIndexComponent extends BaseComponent implements OnInit {

  constructor() {
    super(null, CommonUtils.getPermissionCode("resource.configArmyCondition"));

  }

  ngOnInit() {
  }

}





