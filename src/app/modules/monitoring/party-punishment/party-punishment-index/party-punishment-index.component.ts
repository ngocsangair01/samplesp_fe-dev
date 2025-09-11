import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { ActivatedRoute } from '@angular/router';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'party-punishment-index',
  templateUrl: './party-punishment-index.component.html'
})
export class PartyPunishmentIndexComponent extends BaseComponent implements OnInit {

  constructor(
    public actr: ActivatedRoute
  ) {
    super(actr, CommonUtils.getPermissionCode("resource.partyPunishment"));
  }

  ngOnInit() {
  }

}
