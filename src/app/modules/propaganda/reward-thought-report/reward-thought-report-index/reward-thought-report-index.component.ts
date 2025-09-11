import { BaseComponent } from '../../../../shared/components/base-component/base-component.component';
import { Component, OnInit } from '@angular/core';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'reward-thought-report-index',
  templateUrl: './reward-thought-report-index.component.html'
})
export class RewardThoughtReportIndexComponent extends BaseComponent implements OnInit {

  constructor() {
    super(null, CommonUtils.getPermissionCode("resource.propagandaRewardThoughtReport"));
   }

  ngOnInit() {
  }

}