import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'reward-proposal-index',
  templateUrl: './reward-proposal-index.component.html'
})
export class RewardProposalIndexComponent extends BaseComponent implements OnInit {

  constructor() {
    super(null, CommonUtils.getPermissionCode("resource.propaganda"));
   }

  ngOnInit() {
  }

}
