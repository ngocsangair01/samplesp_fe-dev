import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, APP_CONSTANTS, DEFAULT_MODAL_OPTIONS, OrganizationService, SELECTION_STATUS } from '@app/core';
import { HrStorage } from '@app/core/services/HrStorage';
import { RewardProposeService } from '@app/core/services/reward-propose/reward-propose.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RewardProposeUnapproveComponent } from '../reward-propose-unapprove/reward-propose-unapprove.component';
import { DialogService } from 'primeng/api';
import { popupReasonCancel } from './reward-propose-reason-cancel/reward-propose-reason-cancel';
import { popupRejectReason } from './reward-propose-reject-reason/reward-propose-reject-reason';
import { AuthorityFormComponent } from './authority-form/authority-form.component'

@Component({
  selector: 'reward-propose-approve-search',
  templateUrl: './reward-propose-approve-search.component.html',
  styleUrls: ['./reward-propose-approve-search.component.css']
})
export class RewardProposeApproveSearchComponent extends BaseComponent implements OnInit {
  formSearch: FormGroup;
  listStatus: any;
  periodTypeList: any;
  selectedGop = [];
  rewardProposeIdList = [];
  rewardTypeListByUser: any;
  rewardTypeListByUserToApproval: boolean;
  rootPartyId = APP_CONSTANTS.PARTY_ORG_ROOT_ID;
  rootOrgId = APP_CONSTANTS.ORG_ROOT_ID;
  formconfig = {
    rewardProposeId: [null],
    name: [null],
    periodType: [null],
    status: [null],
    proposeOrgId: [null],
    approvalOrgId: [null],
    proposeYear: [null],
    rewardType: [null],
    signOrgId: [null],
    organizationId: [null],
    employeeId: [null],
    rewardDecideCode: [null],
    totalAmountOfMoney: [null],
    isApprovalScreen: [1],
    proposeSynthetic: [null],
    decisionSynthetic: [null],
    fromDate: [null],
    toDate: [null],
    isAuthority: [null],
    isName: [false],
    isProposeOrgId: [false],
    isRewardType: [false],
    isApprovalOrgId: [false],
    isStatus: [false],
    isSignOrgId: [false],
    isPeriodType: [false],
    isProposeYear: [false],
    isFromDate: [false],
    isToDate: [false],
  }
  private operationKey = 'action.view';
  private adResourceKey = 'resource.rewardPropose';
  private defaultDomain: any;
  listYear: any;
  rewardTypeList: any;

  constructor(
    private rewardProposeService: RewardProposeService,
    private app: AppComponent,
    private router: Router,
    public modalService: NgbModal,
    private service: OrganizationService,
    public dialogService: DialogService,
  ) {
    super(null, CommonUtils.getPermissionCode("resource.rewardPropose"));
    this.listStatus = APP_CONSTANTS.SELECTION_STATUS_LIST;
    this.setMainService(rewardProposeService);
    this.formSearch = this.buildForm({}, this.formconfig, ACTION_FORM.VIEW);
    this.periodTypeList = APP_CONSTANTS.REWARD_PERIOD_TYPE_LIST;
    this.listYear = this.getYearList();
    this.rewardTypeList = APP_CONSTANTS.REWARD_GENERAL_TYPE_LIST;
    this.formSearch = this.buildForm({}, this.formconfig, ACTION_FORM.VIEW, [
      ValidationService.notAffter('fromDate', 'toDate', 'common.label.toDate')]);
  }

  ngOnInit() {
    //Lấy miền dữ liệu mặc định theo nv đăng nhập
    this.defaultDomain = HrStorage.getDefaultDomainByCode(CommonUtils.getPermissionCode(this.operationKey)
      , CommonUtils.getPermissionCode(this.adResourceKey));
    // search
    if (this.defaultDomain) {
      this.service.findOne(this.defaultDomain)
        .subscribe((res) => {
          const data = res.data;
          if (data) {
            this.f['proposeOrgId'].setValue(data.organizationId);
          }
          this.processSearch();
        });
    } else {
      this.processSearch();
    }
    this.rewardProposeService.getRewardTypeList().subscribe(res => {
      this.rewardTypeListByUser = this.rewardTypeList.filter((item) => {
        return res.includes(item.id)
      })
  })
      // this.processSearch();
  }

  get f() {
    return this.formSearch.controls;
  }

  public processView(item) {
    this.rewardProposeService.findOne(item.rewardProposeId)
      .subscribe(res => {
        if (res.data != null) {
          this.router.navigate(['/reward/reward-propose-approval/view-selection/', item.rewardProposeId]);
        }
      });
  }

  /**
  * xét chọn
  */
  public prepareApprove(item) {
    this.rewardProposeService.findOne(item.rewardProposeId)
      .subscribe(res => {
        if (res.data != null) {
          this.router.navigate(['/reward/reward-propose-approval/edit-selection/', item.rewardProposeId]);
        }
      });
  }

  /**
   * hủy xét chọn
  */
  public cancelApproval(item) {
    const ref = this.dialogService.open(popupReasonCancel, {
      header: 'Lý do hủy',
      width: '50%',
      baseZIndex: 1500,
      contentStyle: {"padding": "0"},
      data: item
    });
    ref.onClose.subscribe( (res) => {
      this.processSearch();
    })
  }
  /**
   * từ chối đề xuất
  */
  public cancelOffer(item) {
    const ref = this.dialogService.open(popupRejectReason, {
      header: 'Lý do từ chối',
      width: '50%',
      baseZIndex: 1500,
      contentStyle: {"padding": "0"},
      data: item
    });
    ref.onClose.subscribe( (res) => {
      this.processSearch();
    })
  }

  public processSearch(event?): void {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    const params = this.formSearch ? this.formSearch.value : null;
    this.rewardProposeService.search(params, event).subscribe(res => {
      this.resultList = res;
      for (const item of this.resultList.data) {
        if (item.status !== 2) {
          break;
        }
      }
    });
    if (!event) {
      if (this.dataTable) {
        this.dataTable.first = 0;
      }
    }
  }

  private getYearList() {
    this.listYear = [];
    const currentYear = new Date().getFullYear();
    for (let i = (currentYear - 20); i <= (currentYear); i++) {
      const obj = {
        year: i
      };
      this.listYear.push(obj);
    }
    return this.listYear;
  }

  // export file danh sách khen thuong chi tiết
  public exportFileRewardObject(item) {
      this.rewardProposeService.actionExportRewardProposeObject(item.rewardProposeId).subscribe(res => {
        saveAs(res, "DS_xet_chon_khen_thuong_chi_tiet.xls");
      });
  }

  //hàm check quyền xét chọn
  public checkHiddenApprove(item) {
    this.rewardProposeService.getRewardTypeList().subscribe(res => {
      this.rewardTypeListByUserToApproval = res.includes(item.rewardType)
    })
  }

  //mở dialog ủy quyền
  openDialogAuthority(item) {
    const ref = this.dialogService.open(AuthorityFormComponent, {
      header: 'Nội dung ủy quyền',
      width: '50%',
      baseZIndex: 1500,
      contentStyle: {"padding": "0"},
      data: item
    });
    ref.onClose.subscribe( (res) => {
      this.processSearch();
    });
  }
}

