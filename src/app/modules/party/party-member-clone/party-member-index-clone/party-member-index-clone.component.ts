import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'party-member-index-clone',
  templateUrl: './party-member-index-clone.component.html',
})
export class PartyMemberIndexCloneComponent extends BaseComponent implements OnInit {
  warningType;
  constructor(
    private router: Router,
    public actr: ActivatedRoute,
  ) {
    super(null, CommonUtils.getPermissionCode("resource.partyMember"));
    this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        const params = this.actr.snapshot.params;
        if (params) {
          this.warningType = params.warningType;
        }
      }
    });
  }

  ngOnInit() {
  }

}
