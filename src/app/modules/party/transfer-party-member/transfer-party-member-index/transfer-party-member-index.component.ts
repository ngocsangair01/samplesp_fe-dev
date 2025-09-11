import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'transfer-party-member-index',
  templateUrl: './transfer-party-member-index.component.html'
})
export class TransferPartyMemberIndexComponent extends BaseComponent implements OnInit {

  constructor() {
    super(null, CommonUtils.getPermissionCode("resource.transferPartyMember"));
  }

  ngOnInit() {
  }

}
