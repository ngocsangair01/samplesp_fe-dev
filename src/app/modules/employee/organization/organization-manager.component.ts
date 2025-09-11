import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { OrgTreeComponent } from '@app/shared/components/org-tree/org-tree.component';
import { CommonUtils } from '@app/shared/services';
import { HelperService } from '@app/shared/services/helper.service';

@Component({
  selector: 'organization-manager',
  templateUrl: './organization-manager.component.html',
})
export class OrganizationManagerComponent extends BaseComponent implements OnInit {
  resultList: any = {};
  currentNode: any;
  @ViewChild('orgTree')
  orgTree: OrgTreeComponent;

  constructor(
    private router: Router
    , private helperService: HelperService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.managerOrganization"));
  }

  public treeSelectNode(event) {
    this.router.navigate(['employee/organization/search/', event.node.nodeId]);
  }

  ngOnInit() {
  }

  public onReloadTree() {
    this.orgTree.actionInitAjax();
  }
}
