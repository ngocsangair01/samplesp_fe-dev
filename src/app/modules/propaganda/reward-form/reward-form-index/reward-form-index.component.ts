import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { Component, OnInit } from '@angular/core';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'reward-form-index',
  templateUrl: './reward-form-index.component.html',
  styleUrls: ['./reward-form-index.component.css']
})
export class RewardFormIndexComponent extends BaseComponent implements OnInit {

  constructor() {
    super(null, CommonUtils.getPermissionCode("resource.propagandaRewardForm"));
  }

  ngOnInit() {
  }

}
