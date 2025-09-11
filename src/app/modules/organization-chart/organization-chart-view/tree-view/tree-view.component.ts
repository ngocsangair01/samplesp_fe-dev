import { Component, OnInit, Input } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { OrganizationService, EmployeeInfoService } from '@app/core';
import { environment } from '@env/environment';

@Component({
  selector: 'tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.css']
})

export class TreeViewComponent implements OnInit {
  @Input()
  orgId: number;
  
  isHaveConfig: boolean;
  rootOrg: TreeNode;
  data: TreeNode[];
  public API_URL = environment.serverUrl['political'];

  constructor(private orgService: OrganizationService) {
    this.rootOrg = {
      label: '',
      data: '',
      expanded: true,
      children: []
    };
    this.isHaveConfig = true;
  }

  ngOnInit() {
    this.data = [{
      label: 'sangnn',
      styleClass: 'ui-org',
      data: {orgChartId: 'rootsangnn'},
      type: 'node',
      expanded: true,
      children: []
    }];
  }
  loadRootTree(rootId){
    this.orgService.findOrgViewDetail(rootId)
    .subscribe(res => {
      if (res.data) {
        // Set root node of org tree
        this.data = [{
          label: 'sangnn',
          styleClass: 'ui-org',
          data: {orgChartId: 'rootsangnn'},
          type: 'node',
          expanded: true,
          children: []
        }];
        this.isHaveConfig = true;
        this.orgId = rootId;
      } else {
        this.isHaveConfig = false;
        this.data =[{}];
      }
    });
  }

  onNodeSelect(event) {
    if (event['node']['children'].length > 0) {
      return;
    } else {
      this.searchTree(this.data[0], event['node']['data']);
    }
  }
  searchTree(element, matchingData) {
    if (matchingData.orgChartId === 'rootsangnn') {
      this.orgService.findOrgViewDetail(this.orgId)
      .subscribe(res => {
        if (res && res.length !== 0) {
          let childNode: TreeNode;
          childNode = {
            label: res.data.name,
            styleClass: 'ui-org',
            data: res.data,
            type: 'node',
            expanded: true,
            children: []
          };
          element.children.push(childNode);
        }
      });
      return;
    } else if (element.data.orgChartId === matchingData.orgChartId) {
      this.orgService.findListChildViewDetail(matchingData.orgChartId)
      .subscribe(res => {
        if (res && res.length !== 0) {
          let i = 0;
          res.data.forEach(function (value) {
            let childNode: TreeNode;
            childNode = {
              label: value.name,
              styleClass: 'ui-org',
              data: value,
              type: 'node',
              expanded: true,
              children: []
            };
            element.children[i] = childNode;
            i++;
          });
        }
      });
      return;
    } else if (element.children) {
      let i: number;
      let result = null;
      for ( i = 0; result == null && i < element.children.length; i++) {
        result = this.searchTree(element.children[i], matchingData);
      }
      return result;
    }
    return;
  }
}
