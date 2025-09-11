import { Component, Input } from '@angular/core';
import { BaseControl } from '@app/core/models/base.control';
import { ReportInputGenerateComponent } from '../report-input-generate.component';

@Component({
  template: `
    <dynamic-input  [property]="control"
                    [labelValue]="label"
                    [labelClass]="'ui-g-12 ui-md-6 ui-lg-4 control-label vt-align-right required ng-star-inserted'"
                    [inputClass]="'ui-g-12 ui-md-12 ui-lg-6'"
                    [usedLocaleLabel]="'false'">
    </dynamic-input>
  `
})
export class InputTextComponent implements ReportInputGenerateComponent {
  @Input() control: BaseControl;
  @Input() label: string;
}
