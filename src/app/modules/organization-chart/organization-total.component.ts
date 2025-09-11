import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { OrgTreeComponent } from '@app/shared/components/org-tree/org-tree.component';
import { CommonUtils } from '@app/shared/services';
import { OrganizationChartComponent } from './organization-chart-view/organization-chart.component';

@Component({
  selector: 'organization-total',
  templateUrl: './organization-total.component.html',
})
export class OrganizationTotalComponent extends BaseComponent implements OnInit {
  resultList: any = {};
  currentNode: any;
  @ViewChild('orgTree')
  orgTree: OrgTreeComponent;
  @ViewChild('orgChart')
  orgChart: OrganizationChartComponent;
  
  constructor(
  ) {
    super(null, CommonUtils.getPermissionCode("resource.partyOrganization"));
  }

  public treeSelectNode(event) {
    this.orgChart.LoadRoot(event.node.nodeId);
  }

  ngOnInit() {
  }

}
