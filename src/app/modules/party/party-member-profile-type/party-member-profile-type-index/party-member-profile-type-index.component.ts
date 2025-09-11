import { CommonUtils } from '@app/shared/services/common-utils.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'party-member-profile-type-index',
  templateUrl: './party-member-profile-type-index.component.html'
})
export class PartyMemberProfileTypeIndexComponent extends BaseComponent implements OnInit {

  constructor(
    private router: Router,
    public actr: ActivatedRoute,
  ) {
    super(null, CommonUtils.getPermissionCode("resource.partyMemberProfileType"));
  }

  ngOnInit() {
  }

}
