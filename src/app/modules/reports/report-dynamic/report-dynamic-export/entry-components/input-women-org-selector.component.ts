import { Component, Input } from '@angular/core';
import { BaseControl } from '@app/core/models/base.control';
import { ReportInputGenerateComponent } from '../report-input-generate.component';

@Component({
  template: `
    <label [ngClass]="{'required': control.isRequire}" class="ui-g-6 ui-md-3 ui-lg-1 control-label vt-align-right required" style="margin-top: 8px;">
      {{label}}
    </label>
    <div class="ui-g-6 ui-md-3 ui-lg-2">
      <mass-org-selector [property]="control" operationKey="action.view"
        adResourceKey="resource.reportDynamic" [defaultValue]="true" [isRequiredField]="control.isRequire"
        [branch]="1">
      </mass-org-selector>
      <app-control-messages [control]="control"></app-control-messages>
    </div>
  `
})
export class InputWomenOrgSelectorComponent implements ReportInputGenerateComponent {
  @Input() control: BaseControl;
  @Input() label: string;
}
