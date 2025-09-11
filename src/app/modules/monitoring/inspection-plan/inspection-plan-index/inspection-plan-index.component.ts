import { Component } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'inspection-plan-index',
  templateUrl: './inspection-plan-index.component.html',
})
export class InspectionPlanIndexComponent extends BaseComponent {

  constructor() {
    super(null, CommonUtils.getPermissionCode("resource.inspectionPlan"));
  }

}
