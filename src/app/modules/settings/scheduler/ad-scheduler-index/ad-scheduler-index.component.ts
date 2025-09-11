import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'ad-scheduler-sign-index',
  templateUrl: './ad-scheduler-index.component.html',
  styleUrls: ['./ad-scheduler-index.component.css']
})
export class AdSchedulerIndexComponent extends BaseComponent implements OnInit {

  constructor() {
    super(null, CommonUtils.getPermissionCode("resource.adScheduler"))
   }

  ngOnInit() {
  }

}
