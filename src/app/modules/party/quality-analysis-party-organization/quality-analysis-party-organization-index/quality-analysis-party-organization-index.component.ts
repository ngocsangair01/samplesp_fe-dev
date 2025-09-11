import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'quality-analysis-party-organization-index',
  templateUrl: './quality-analysis-party-organization-index.component.html'
})
export class QualityAnalysisPartyOrganizationIndexComponent extends BaseComponent implements OnInit {

  constructor() {
    super(null, CommonUtils.getPermissionCode("resource.qualityAnalysisParty"));
  }

  ngOnInit() {
  }

}
