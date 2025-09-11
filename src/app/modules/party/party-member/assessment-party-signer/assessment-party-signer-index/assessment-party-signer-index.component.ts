import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'assessment-party-signer-index',
  templateUrl: './assessment-party-signer-index.component.html'
})
export class AssessmentPartySignerIndexComponent extends BaseComponent implements OnInit {
  constructor(
  ) {
    super(null, CommonUtils.getPermissionCode("resource.assessmentLevelPartyOrganization"))
  }

  ngOnInit() {
  }
}
