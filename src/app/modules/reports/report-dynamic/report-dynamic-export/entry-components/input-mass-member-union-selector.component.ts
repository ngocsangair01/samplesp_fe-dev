import { Component, Input } from '@angular/core';
import { BaseControl } from '@app/core/models/base.control';
import { ReportInputGenerateComponent } from '../report-input-generate.component';

@Component({
  template: `
    <label [ngClass]="{'required': control.isRequire}" class="ui-g-6 ui-md-3 ui-lg-1 control-label vt-align-right required" style="margin-top: 8px;">
      {{label}}
    </label>
    <div class="ui-g-6 ui-md-3 ui-lg-2">
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
        filterCondition=" AND EXISTS (SELECT 1 FROM mass_member mm WHERE mm.employee_id = obj.employee_id AND mm.branch = 3)"
      >
      </data-picker>
      <app-control-messages [control]="control"></app-control-messages>
    </div>
  `
})
export class InputMassMemberUnionSelectorComponent implements ReportInputGenerateComponent {
  @Input() control: BaseControl;
  @Input() label: string;
}
