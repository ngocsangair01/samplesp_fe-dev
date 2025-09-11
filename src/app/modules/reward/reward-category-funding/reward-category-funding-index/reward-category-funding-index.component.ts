import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'reward-category-funding-index',
  templateUrl: './reward-category-funding-index.component.html'
})
export class RewardCategoryFundingIndexComponent  extends BaseComponent implements OnInit {
  constructor() {
    super(null, CommonUtils.getPermissionCode("resource.rewardGeneral"))
  }

  ngOnInit() {
  }

}
