import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'party-member-decision-index',
  templateUrl: './party-member-decision-index.component.html',
})
export class PartyMemberDecisionIndexComponent extends BaseComponent implements OnInit {

  constructor() {
    super(null, CommonUtils.getPermissionCode("resource.partyMemberDecision"))
  }

  ngOnInit() {
  }

}
