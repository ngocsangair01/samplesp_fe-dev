import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'reward-propose-index',
  templateUrl: './reward-propose-index.component.html',
  styleUrls: ['./reward-propose-index.component.css']
})
export class RewardProposeIndexComponent extends BaseComponent implements OnInit {
  constructor() {
    super(null, CommonUtils.getPermissionCode("resource.rewardPropose"))
   }

  ngOnInit() {
  }

}
