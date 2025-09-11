import { Component, Input } from '@angular/core';
import { BaseControl } from '@app/core/models/base.control';
import { ReportInputGenerateComponent } from '../report-input-generate.component';

@Component({
  template: `
    <div class="ui-g-12">
      <label [ngClass]="{'required': control.isRequire}" class="ui-g-12 ui-md-6 ui-lg-2 control-label vt-align-right">
        {{label}}
      </label>
      <div class="ui-g-12 ui-md-6 ui-lg-3">
        <select-filter [property]="control"  [options]="selectData" optionLabel="name" optionValue="code"
                       [placeHolder]="control.isRequire ? 'common.label.cboMustSelect' : 'common.label.cboSelect'" >
        </select-filter>
        <app-control-messages [control]="control"></app-control-messages>
      </div>
    </div>
  `
})
export class InputComboboxComponent implements ReportInputGenerateComponent {
  @Input() control: BaseControl;
  @Input() label: string;
  @Input() selectData: [];
}
