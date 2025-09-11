import { Component, Input } from '@angular/core';
import { BaseControl } from '@app/core/models/base.control';
import { ReportInputGenerateComponent } from '../report-input-generate.component';

@Component({
  template: `
  <label [ngClass]="{'required': control.isRequire}" class="ui-g-6 ui-md-3 ui-lg-1 control-label vt-align-right required" style="margin-top: 8px;">
    {{label}}
  </label>
  <div class="ui-g-6 ui-md-3 ui-lg-2">
    <div class="form-check-inline nowrap">
      <label class="i-checks">
        <input type="radio" [formControl]="control" class="form-check-input control-label" id="maritalStatus_0" value="0" name="gender">
        <i></i>
        {{'app.position.all' | translate}}
      </label>
    </div>
    <div class="form-check-inline">
      <label class="i-checks">
        <input type="radio" [formControl]="control" class="form-check-input control-label" id="maritalStatus_1" value="1" name="gender">
        <i></i>
        {{'app.position.male' | translate}}
      </label>
    </div>
    <div class="form-check-inline">
      <label class="i-checks">
        <input type="radio" [formControl]="control" class="form-check-input control-label" id="maritalStatus_2" value="2" name="gender">
        <i></i>
        {{'app.position.female' | translate}}
      </label>
    </div>
    <app-control-messages [control]="control"></app-control-messages>
  </div>
  `
})
export class InputGenderComponent implements ReportInputGenerateComponent {
  @Input() control: BaseControl;
  @Input() label: string;
}
