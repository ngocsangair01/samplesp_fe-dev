import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { RewardPartyOrganizationService } from '@app/core/services/party-organization/reward-party-organization.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'reward-party-organization-view',
  templateUrl: './reward-party-organization-view.component.html',
  styleUrls: ['./reward-party-organization-view.component.css']
})
export class RewardPartyOrganizationViewComponent extends BaseComponent implements OnInit {
  data: [];
  recordsTotal: any;
  resultList: any;
  parseInt = parseInt;
  partyOrgName: string = 'Danh sách khen thưởng '
  @ViewChild('ptable') dataTable: any;
  @Input() public importRewardPartyOrgId;

  formSearch: FormGroup;
  formConfig = {
    importRewardPartyOrgId: [''],
  };

  constructor(
    private rewardPartyOrganizationService: RewardPartyOrganizationService,
    public activeModal: NgbActiveModal,
  ) {
    super(null, CommonUtils.getPermissionCode("resource.rewardParty"));
  }

  ngOnInit() {
    this.formSearch = this.buildForm({ importRewardPartyOrgId: this.importRewardPartyOrgId }, this.formConfig);
    this.processSearchRewardPartyOrg();
    this.rewardPartyOrganizationService.getPartyOrganizationNameByImportRewardPartyOrgId(this.importRewardPartyOrgId).subscribe(res => {
      this.partyOrgName += res.data;
    });
  }

  public processSearchRewardPartyOrg(event?): void {
    const importRewardPartyOrgId = this.formSearch.get('importRewardPartyOrgId').value;
    if (importRewardPartyOrgId == null) {
      return;
    }
    this.formSearch.get('importRewardPartyOrgId').setValue(importRewardPartyOrgId);
    const params = this.formSearch ? this.formSearch.value : null;
    this.rewardPartyOrganizationService.searchRewardPartyOrg(params, event).subscribe(res => {
      this.resultList = res;
    });
    if (!event) {
      if (this.dataTable) {
        this.dataTable.first = 0;
      }
    }
  }

  public processExport() {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    const formData = Object.assign({}, this.formSearch.value);
    formData['importRewardPartyOrgId'] = this.importRewardPartyOrgId;

    const params = CommonUtils.buildParams(CommonUtils.convertData(formData));

    this.rewardPartyOrganizationService.exportRewardYearTable(params).subscribe(res => {
      saveAs(res, 'Danh_sach_khen_thuong_to_chuc_dang.xlsx');
    });
  }

  public goBack() {
    this.activeModal.close();
  }
}
