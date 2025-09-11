import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { OrgTreeComponent } from '@app/shared/components/org-tree/org-tree.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'org-tree-terminate',
  templateUrl: './manager-party-terminate.component.html',
})
export class OrgTreeTerminateComponent extends BaseComponent implements OnInit {
  resultList: any = {};
  currentNode: any;
  @ViewChild('orgTree')
  orgTree: OrgTreeComponent;

  constructor(
    private router: Router
  ) {
    super(null, CommonUtils.getPermissionCode("resource.partyOrganization"));
  }

  public treeSelectNode(event) {
    this.router.navigate(['/party-organization/party-organization-management/termination/search/', event.node.nodeId]);
  }

  ngOnInit() {
  }
}
