import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { QualityAnalysisPartyOrgService } from '@app/core/services/party-organization/quality-analysis-party-org.service';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'quality-rating-party-organization',
  templateUrl: './quality-rating-party-organization.component.html',
  styleUrls: ['./quality-rating-party-organization.component.css']
})
export class QualityRatingPartyOrganizationComponent extends BaseComponent implements OnInit {

  @Input()
  public partyOrganizationId: any;
  formConfig = {
    partyOrganizationId: [''],
    status: ['']
  };

  constructor(private qualityAnalysisPartyOrgService: QualityAnalysisPartyOrgService) {
    super(null, CommonUtils.getPermissionCode("resource.partyOrganization"));
    this.setMainService(qualityAnalysisPartyOrgService);
  }

  ngOnInit() {

    this.formSearch = this.buildForm({ partyOrganizationId: this.partyOrganizationId, status: 3 }, this.formConfig);
    this.processSearch();
  }

  // public processSearchQualityAnalysisPartyOrg(event?): void {
  //
  //   const params = this.formSearch ? this.formSearch.value : null;
  //   this.qualityAnalysisPartyOrgService.searchQualityAnalysisPartyOrganization(params, event).subscribe(res => {
  //     this.resultList = res;
  //   });
  //   if (!event) {
  //     if (this.dataTable) {
  //       this.dataTable.first = 0;
  //     }
  //   }
  // }
}
