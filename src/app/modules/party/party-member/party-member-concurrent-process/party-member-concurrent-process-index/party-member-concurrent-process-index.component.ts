import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'party-member-concurrent-process-index',
  templateUrl: './party-member-concurrent-process-index.component.html',
})
export class PartyMemberConcurrentProcessIndexComponent extends BaseComponent implements OnInit {

  constructor() {
    super(null, CommonUtils.getPermissionCode("resource.partyMember"))
  }

  ngOnInit() {
  }

}
