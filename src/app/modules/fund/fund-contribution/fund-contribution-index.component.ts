import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'fund-contribution',
  templateUrl: './fund-contribution-index.component.html',
})
export class FundContributionComponent extends BaseComponent implements OnInit {
  constructor() {
    super(null, CommonUtils.getPermissionCode("resource.fundContribution"));
  }
  ngOnInit() {
  }
}