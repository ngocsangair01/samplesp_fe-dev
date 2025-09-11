import { AssessmentPartyOrganizationService } from '@app/core/services/assessment-party-organization/assessment-party-organization.service';
import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'assessment-party-organization-index',
  templateUrl: './assessment-party-organization-index.component.html'
})
export class AssessmentPartyOrganizationIndexComponent extends BaseComponent implements OnInit {
  constructor(
  ) {
    super(null, CommonUtils.getPermissionCode("resource.assessmentPartyOrganization"))
  }

  ngOnInit() {
  }
}
