import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute} from '@angular/router';
import { FormGroup } from '@angular/forms';
import { ACTION_FORM, APP_CONSTANTS, OrganizationService } from '@app/core';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { RewardProposeService } from '@app/core/services/reward-propose/reward-propose.service';

@Component({
  selector: 'reward-decide-list.component',
  templateUrl: './reward-decide-list.component.html',
  styleUrls: ['./reward-decide-list.component.css']
})
export class RewardDecideListComponent extends BaseComponent implements OnInit {
  formSearch: FormGroup;
  lstReason: any;
  selectedRows:[];
  formConfig = {
    name: [null],
    proposeOrgId: [null],
    rewardType: [null],
    approvalOrgId: [null],
    rewardProposeId: [null],
    rewardProposeSignId: [null],
    status: [null],
    proposeYear: [null],
    periodType: [null],
    ignoreList: [null],
    isChoose: [null],
    isSuggest: [null],
    isSuggestScreen: [null],
    isDecisionScreen: [null],
    isAuthority: [''],
  };
  formTable: {data: null, recordsTotal: 0};
  isPersonal: boolean;
  rewardTypeList = APP_CONSTANTS.REWARD_PROPOSE_TYPE_LIST;
  listStatus = APP_CONSTANTS.REWARD_PROPOSE_STATUS2;
  lstPeriodType = APP_CONSTANTS.REWARD_PERIOD_TYPE_LIST;
  listYear: any;
  rewardObjectType: any;
  public dataError: any;
  public criteriaPlanTree;
  public massRequestId: any;
  public partyOrganizationId: any;

  constructor(
    public activeModal: NgbActiveModal,
    public actr: ActivatedRoute,
    private rewardProposeService: RewardProposeService
  ) {
    super(null, 'REQUEST_RESOLUTION_QUARTER_YEAR');
    this.formSearch = this.buildForm({}, this.formConfig);
    this.setMainService(rewardProposeService);
  }

  ngOnInit() {
    this.listYear = this.getYearList();
  }

  get f() {
    return this.formSearch.controls;
  }
  private getYearList() {
    this.listYear = [];
    const currentYear = new Date().getFullYear();
    for (let i = (currentYear - 20); i <= currentYear; i++) {
      const obj = {
        year: i
      };
      this.listYear.push(obj);
    }
    return this.listYear;
  }
  public setFormValue(propertyConfigs: any, data?: any) {
    this.propertyConfigs = propertyConfigs;
    this.formSearch = this.buildForm(data.formSearch, this.formConfig, ACTION_FORM.INSERT, [])
    this.searchData();
  }
  searchData(event?: any) {
    this.rewardProposeService.getDatatablesConfirmed(this.formSearch.value , event).subscribe((res) => {
      this.formTable = res
    })
  }
  processImport() {
    this.activeModal.close(this.selectedRows);
    this.dataError = null;
  }
}
