import { Component, OnInit } from '@angular/core';
import { CommonUtils } from '@app/shared/services';
import { BaseComponent } from '../../../../shared/components/base-component/base-component.component';

@Component({
  selector: 'expression-report-recorded-index',
  templateUrl: './expression-report-recorded-index.component.html'
})
export class ExpressionReportRecordedIndexComponent extends BaseComponent implements OnInit {

  constructor() {
    super(null, CommonUtils.getPermissionCode("resource.expressionReportRecorded"));
   }

  ngOnInit() {
  }

}