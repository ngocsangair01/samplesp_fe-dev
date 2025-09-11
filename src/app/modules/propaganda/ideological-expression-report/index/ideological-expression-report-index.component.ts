import { Component } from '@angular/core';
import { CommonUtils } from '@app/shared/services';
import { BaseComponent } from '../../../../shared/components/base-component/base-component.component';

@Component({
  selector: 'ideological-expression-report-index',
  templateUrl: './ideological-expression-report-index.component.html'
})
export class IdeologicalExpressionReportIndexComponent extends BaseComponent {

  constructor() {
    super(null, CommonUtils.getPermissionCode("resource.ideologicalExpressionReport"));
   }

}