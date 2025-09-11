import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'reward-party-organization-index',
  templateUrl: './reward-party-organization-index.component.html',
})
export class RewardPartyOrganizationIndexComponent extends BaseComponent implements OnInit {

  constructor() {
    super(null, CommonUtils.getPermissionCode("resource.rewardParty"));
  }

  ngOnInit() {
  }

}
