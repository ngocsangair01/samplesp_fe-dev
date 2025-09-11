import { Component, Input } from '@angular/core';
import { BaseControl } from '@app/core/models/base.control';
import { ReportInputGenerateComponent } from '../report-input-generate.component';

@Component({
  template: `
    <label [ngClass]="{'required': control.isRequire}" class="ui-g-12 ui-md-6 ui-lg-4 control-label vt-align-right required ng-star-inserted">
      {{label}}
    </label>
    <div class="ui-g-12 ui-md-12 ui-lg-6">
      <data-picker
        [property]="control"
        systemCode="political"
        operationKey="action.view"
        adResourceKey="resource.reportDynamic"
        objectBO="EmployeeBO"
        codeField="employeeCode"
        nameField="fullName"
        emailField="email"
        selectField="employeeId"
        [isRequiredField]="control.isRequire"
        filterCondition=" AND EXISTS (SELECT 1 FROM party_member pm WHERE pm.employee_id = obj.employee_id AND EXISTS (SELECT 1 FROM party_member_process pmp WHERE pmp.party_member_id = pm.party_member_id))"
      >
      </data-picker>
      <app-control-messages [control]="control"></app-control-messages>
    </div>
  `
})
export class InputPartyMemberSelectorComponent implements ReportInputGenerateComponent {
  @Input() control: BaseControl;
  @Input() label: string;
}
