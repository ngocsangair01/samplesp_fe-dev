import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from '@angular/router';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { MassOrgTreeComponent } from './../../shared/components/mass-org-tree/mass-org-tree.component';
import { HelperService } from './../../shared/services/helper.service';

// tree
@Component({
  selector: 'mass-organization',
  templateUrl: './mass-organization.component.html',
})
export class MassOrganizationComponent extends BaseComponent implements OnInit {

  resultList: any = {};
  currentNode: any;
  branch: any;
  @ViewChild('orgTree')
  massTree: MassOrgTreeComponent;

  constructor(
    private router: Router,
    private helperService: HelperService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.massOrganization"));
    const subPaths = this.router.url.split('/');
    if (subPaths.length >= 2) {
      if (subPaths[2] === 'organization-women') {
        this.branch = 1;
      }
      if (subPaths[2] === 'organization-youth') {
        this.branch = 2;
      }
      if (subPaths[2] === 'organization-union') {
        this.branch = 3;
      }
    }
  }
  public treeSelectNode(event) {
    if (this.branch == 1) {
      this.router.navigate(['/mass/organization-women/search/', event.node.nodeId]);
      this.helperService.MASS_ORGANIZATION.subscribe(data => {
        if (data === 'complete') {
          this.onReloadTree();
        }
      });
    }
    if (this.branch == 2) {
      this.router.navigate(['/mass/organization-youth/search/', event.node.nodeId]);
      this.helperService.MASS_ORGANIZATION.subscribe(data => {
        if (data === 'complete') {
          this.onReloadTree();
        }
      });
    }
    if (this.branch == 3) {
      this.router.navigate(['/mass/organization-union/search/', event.node.nodeId]);
      this.helperService.MASS_ORGANIZATION.subscribe(data => {
        if (data === 'complete') {
          this.onReloadTree();
        }
      });
    }
  }
  ngOnInit(): void {
    this.helperService.MASS_ORGANIZATION.subscribe(data => {
      if (data === 'importSuccess') {
        this.massTree.actionInitAjax();
      }
    });
  }
  public onReloadTree() {
    this.massTree.actionInitAjax();
  }
}