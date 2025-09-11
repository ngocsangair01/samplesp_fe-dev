import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'reward-party-member-index',
  templateUrl: './reward-party-member-index.component.html',
})
export class RewardPartyMemberIndexComponent extends BaseComponent implements OnInit {

  constructor() {
    super(null, CommonUtils.getPermissionCode("resource.rewardParty"));
  }

  ngOnInit() {
  }

}
