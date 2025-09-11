import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'reward-propose-approve-index',
  templateUrl: './reward-propose-approve-index.component.html',
  styleUrls: ['./reward-propose-approve-index.component.css']
})
export class RewardProposeApproveIndexComponent extends BaseComponent implements OnInit {

  constructor() {
    super(null, CommonUtils.getPermissionCode("resource.rewardPropose"))
   }

  ngOnInit() {
  }

}
