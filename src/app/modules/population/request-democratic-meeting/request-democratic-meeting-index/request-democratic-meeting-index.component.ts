import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'request-democratic-meeting-index',
  templateUrl: './request-democratic-meeting-index.component.html',
})
export class RequestDemocraticMeetingIndexComponent extends BaseComponent implements OnInit {

  constructor() {
    super(null, CommonUtils.getPermissionCode("resource.requestDemocraticMeeting"));
  }

  ngOnInit() {
  }

}
