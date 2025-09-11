import { Component, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { OrgTreeComponent } from '@app/shared/components/org-tree/org-tree.component';
import { CommonUtils } from '@app/shared/services';
import { HelperService } from '@app/shared/services/helper.service';

@Component({
  selector: 'assessment-monitor',
  templateUrl: './assessment-monitor.component.html',
})
export class AssessmentMonitorComponent extends BaseComponent implements OnInit {
  resultList: any = {};
  currentNode: any;
  @ViewChild('orgTree')
  orgTree: OrgTreeComponent;

  constructor(
    private router: Router
    , private helperService: HelperService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.assessmentPeriod"));
  }

  public treeSelectNode(event) {
    this.helperService.ASSESSMENT_MONITOR.next(event);// gửi selected note to other components
  }

  ngOnInit() {
  }

  public onReloadTree() {
    this.orgTree.actionInitAjax();
  }
}
