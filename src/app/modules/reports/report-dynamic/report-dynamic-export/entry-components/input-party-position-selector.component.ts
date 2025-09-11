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
        objectBO="PartyPositionBO"
        codeField="code"
        nameField="name"
        selectField="partyPositionId"
        [isRequiredField]="control.isRequire"
      >
      </data-picker>
      <app-control-messages [control]="control"></app-control-messages>
    </div>
  `
})
export class InputPartyPositionSelectorComponent implements ReportInputGenerateComponent {
  @Input() control: BaseControl;
  @Input() label: string;
}
