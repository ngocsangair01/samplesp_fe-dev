import { Component, OnInit } from '@angular/core';
import { CommonUtils } from '@app/shared/services';
import { BaseComponent } from '../../../../shared/components/base-component/base-component.component';

@Component({
  selector: 'reward-thought-index',
  templateUrl: './reward-thought-index.component.html'
})
export class RewardThoughtIndexComponent extends BaseComponent implements OnInit {

  constructor() {
    super(null, CommonUtils.getPermissionCode("resource.propagandaRewardThought"));
   }

  ngOnInit() {
  }

}