import { Component, Input } from '@angular/core';
import { BaseControl } from '@app/core/models/base.control';
import { ReportInputGenerateComponent } from '../report-input-generate.component';

@Component({
  template: `
    <dynamic-input  [property]="control"
                    [labelValue]="label"
                    [labelClass]="'ui-g-6 ui-md-3 ui-lg-1 control-label vt-align-right required'"
                    [inputClass]="'ui-g-6 ui-md-3 ui-lg-2'"
                    [usedLocaleLabel]="'false'">
    </dynamic-input>
  `
})
export class InputTextComponent implements ReportInputGenerateComponent {
  @Input() control: BaseControl;
  @Input() label: string;
}
