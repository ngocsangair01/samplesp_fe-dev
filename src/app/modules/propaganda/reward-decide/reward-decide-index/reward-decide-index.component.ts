import { BaseComponent } from './../../../../shared/components/base-component/base-component.component';
import { Component, OnInit } from '@angular/core';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'reward-decide-index',
  templateUrl: './reward-decide-index.component.html',
  styleUrls: ['./reward-decide-index.component.css']
})
export class RewardDecideIndexComponent extends BaseComponent implements OnInit {

  constructor() {
    super(null, CommonUtils.getPermissionCode("resource.propaganda"));
   }

  ngOnInit() {
  }

}
