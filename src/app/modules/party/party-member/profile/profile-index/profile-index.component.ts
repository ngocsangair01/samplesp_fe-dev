import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'profile-index',
  templateUrl: './profile-index.component.html'
})
export class ProfileIndexComponent extends BaseComponent implements OnInit {

  constructor() {
    super(null, CommonUtils.getPermissionCode("resource.partyMemberProfile"));
  }

  ngOnInit() {
  }

}
