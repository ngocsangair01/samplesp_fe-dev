import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'democratic-meeting-index',
  templateUrl: './democratic-meeting-index.component.html',
})
export class DemocraticMeetingIndexComponent extends BaseComponent implements OnInit {

  constructor() {
    super(null, CommonUtils.getPermissionCode("resource.requestDemocraticMeeting"));
  }

  ngOnInit() {
  }

}
