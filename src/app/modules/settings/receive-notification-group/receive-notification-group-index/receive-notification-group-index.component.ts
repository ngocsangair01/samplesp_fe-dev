import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'receive-notification-group-index',
  templateUrl: './receive-notification-group-index.component.html'
})
export class ReceiveNotificationGroupIndexComponent extends BaseComponent implements OnInit {

  constructor() {
    super(null, CommonUtils.getPermissionCode("resource.receiveNotificationGroup"));
  }

  ngOnInit() {
  }

}
