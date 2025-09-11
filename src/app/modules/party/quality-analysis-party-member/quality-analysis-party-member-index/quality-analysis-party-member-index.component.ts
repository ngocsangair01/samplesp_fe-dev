import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'quality-analysis-party-member-index',
  templateUrl: './quality-analysis-party-member-index.component.html'
})
export class QualityAnalysisPartyMemberIndexComponent extends BaseComponent implements OnInit {

  constructor() {
    super(null, CommonUtils.getPermissionCode("resource.qualityAnalysisParty"));
   }

  ngOnInit() {
  }

}
