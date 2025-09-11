import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'reward-category-index',
  templateUrl: './reward-category-index.component.html'
})
export class RewardCategoryIndexComponent  extends BaseComponent implements OnInit {
  constructor() {
    super(null, CommonUtils.getPermissionCode("resource.rewardGeneral"))
  }

  ngOnInit() {
  }

}
