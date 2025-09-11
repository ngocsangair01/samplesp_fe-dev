import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { OrgTreeComponent } from '@app/shared/components/org-tree/org-tree.component';
import { CommonUtils } from '@app/shared/services';
import { HelperService } from '@app/shared/services/helper.service';

@Component({
  selector: 'manager-party-organization',
  templateUrl: './manager-party-organization.component.html',
})
export class ManagerPartyOrganizationComponent extends BaseComponent implements OnInit {
  resultList: any = {};
  currentNode: any;
  @ViewChild('orgTree')
  orgTree: OrgTreeComponent;

  constructor(
    private router: Router
    , private helperService: HelperService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.partyOrganization"));
  }

  public treeSelectNode(event) {
    this.router.navigate(['/party-organization/party-organization-management/search/', event.node.nodeId]);
    this.helperService.PARTY_ORGANIZATION.subscribe(data => {
      if (data === 'complete') {
        this.onReloadTree();
      }
    });
  }

  ngOnInit() {
  }

  public onReloadTree() {
    this.orgTree.actionInitAjax();
  }
}
