import { Component, Input } from '@angular/core';
import { BaseControl } from '@app/core/models/base.control';
import { ReportInputGenerateComponent } from '../report-input-generate.component';

@Component({
  template: `
    <div class="ui-g-12">
      <dynamic-input  [property]="control"
                      [labelValue]="label"
                      [labelClass]="'ui-g-12 ui-md-6 ui-lg-2 control-label vt-align-right'"
                      [inputClass]="'ui-g-12 ui-md-6 ui-lg-3'"
                      [usedLocaleLabel]="'false'"
                      [disabled]="control.propertyName === 'period' || control.propertyName === 'requestId' ? true:false">
      </dynamic-input>
    </div>
  `
})
export class InputTextComponent implements ReportInputGenerateComponent {
  @Input() control: BaseControl;
  @Input() label: string;
}
