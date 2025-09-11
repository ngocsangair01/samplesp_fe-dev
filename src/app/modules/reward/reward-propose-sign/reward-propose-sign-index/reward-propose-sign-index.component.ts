import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'reward-propose-sign-index',
  templateUrl: './reward-propose-sign-index.component.html',
  styleUrls: ['./reward-propose-sign-index.component.css']
})
export class RewardProposeSignIndexComponent extends BaseComponent implements OnInit {

  constructor() {
    super(null, CommonUtils.getPermissionCode("resource.rewardPropose"))
   }

  ngOnInit() {
  }

}
