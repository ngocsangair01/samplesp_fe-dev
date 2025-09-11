import { Component, Input } from '@angular/core';
import { BaseControl } from '@app/core/models/base.control';
import { ReportInputGenerateComponent } from '../report-input-generate.component';

@Component({
  template: `
  <label [ngClass]="{'required': control.isRequire}" class="ui-g-12 ui-md-6 ui-lg-4 control-label vt-align-right required ng-star-inserted">
    {{label}}
  </label>
  <div class="ui-g-12 ui-md-12 ui-lg-6">
    <date-picker [property]="control" ></date-picker>
    <app-control-messages [control]="control"></app-control-messages>
  </div>
  `
})
export class InputDatePickerComponent implements ReportInputGenerateComponent {
  @Input() control: BaseControl;
  @Input() label: string;
}
