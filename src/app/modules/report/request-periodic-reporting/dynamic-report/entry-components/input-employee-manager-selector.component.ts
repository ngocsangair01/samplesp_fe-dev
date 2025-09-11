import { Component, Input } from '@angular/core';
import { APP_CONSTANTS } from '@app/core';
import { BaseControl } from '@app/core/models/base.control';
import { ReportInputGenerateComponent } from '../report-input-generate.component';

@Component({
  template: `
    <div class="ui-g-12">
      <label [ngClass]="{'required': control.isRequire}" class="ui-g-12 ui-md-6 ui-lg-2 control-label vt-align-right">
        {{label}}
      </label>
      <div class="ui-g-12 ui-md-6 ui-lg-3">
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
            [filterCondition]="filterCondition"
        >
        </data-picker>
        <app-control-messages [control]="control"></app-control-messages>
      </div>
    </div>
  `
})
export class InputEmployeeManagerSelectorComponent implements ReportInputGenerateComponent {
  @Input() control: BaseControl;
  @Input() label: string;

  public filterCondition = " AND EXISTS (SELECT 1 FROM emp_type_process etp INNER JOIN sys_cat mt ON mt.sys_cat_id = etp.management_type_id WHERE etp.employee_id = obj.employee_id AND (CURRENT_DATE BETWEEN etp.effective_date AND COALESCE(etp.expired_date, CURRENT_DATE)) AND mt.sys_cat_type_id = " + APP_CONSTANTS.SYS_CAT_TYPE_ID.MANAGEMENT_TYPE + ")";
}
