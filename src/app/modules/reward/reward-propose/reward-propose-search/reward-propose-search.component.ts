import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, APP_CONSTANTS, DEFAULT_MODAL_OPTIONS, LARGE_MODAL_OPTIONS, OrganizationService } from '@app/core';
import { AppParamService } from '@app/core/services/app-param/app-param.service';
import { HrStorage } from '@app/core/services/HrStorage';
import { RewardProposeService } from '@app/core/services/reward-propose/reward-propose.service';
import { SignDocumentService } from '@app/core/services/sign-document/sign-document.service';
import { VofficeSigningPreviewModalComponent } from '@app/modules/voffice-signing/preview-modal/voffice-signing-preview-modal.component';
import { ApprovalHistoryModalComponent } from '@app/shared/components/approval-history/approval-history.component';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'reward-propose-search',
  templateUrl: './reward-propose-search.component.html',
  styleUrls: ['./reward-propose-search.component.css']
})
export class rewardProposeSearchComponent extends BaseComponent implements OnInit {
  rootId = APP_CONSTANTS.ORG_ROOT_ID
  formSearch: FormGroup;
  listStatus: any;
  filterConditionEmp: any;
  periodTypeList: any;
  signDocumentId: any;
  rewardTypeListByUser: any;
  rewardType = APP_CONSTANTS.REWARD_GENERAL_TYPE_LIST;
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
    isRequiredSign: [null],
    documentCode: [null],
    startDate: [null],
    endDate: [null],
    fromDate: [null],
    toDate: [null],
    isAuthority: [null],
    authorityContent: [null],
    authorityOrgName: [null],
    proposalType: [null],
    isName: [false],
    isProposeOrgId: [false],
    isRewardType: [false],
    isApprovalOrgId: [false],
    isStatus: [false],
    isSignOrgId: [false],
    isPeriodType: [false],
    isDocumentCode: [false],
    isStartDate: [false],
    isEndDate: [false],
    isFromDate: [false],
    isToDate: [false],
    isShowRequiredSign: [false],
    isProposalType: [false],
  }
  private operationKey = 'action.view';
  private adResourceKey = 'resource.rewardPropose';
  private defaultDomain: any;
  rootPartyId = APP_CONSTANTS.PARTY_ORG_ROOT_ID;
  rootOrgId = APP_CONSTANTS.ORG_ROOT_ID;
  proposalTypeOptions = [
    { name: "DX1–Tập đoàn ra quyết định", value: 1 },
    { name: "DX2–Tập đoàn ủy quyền TCT ra quyết định", value: 2 },
    { name: "DX3-Đơn vị độc lập ra quyết định", value: 3 },
  ]

  constructor(
    private rewardProposeService: RewardProposeService,
    private app: AppComponent,
    private router: Router,
    private service: OrganizationService,
    private modalService: NgbModal,
    private signDocumentService: SignDocumentService,
    private appParamService: AppParamService,
  ) {
    super(null, CommonUtils.getPermissionCode("resource.rewardPropose"));
    this.listStatus = APP_CONSTANTS.REWARD_PROPOSE_STATUS2;
    this.setMainService(rewardProposeService);
    this.formSearch = this.buildForm({}, this.formconfig, ACTION_FORM.VIEW);
    this.periodTypeList = APP_CONSTANTS.REWARD_PERIOD_TYPE_LIST;
    this.formSearch = this.buildForm({}, this.formconfig, ACTION_FORM.VIEW, [
      ValidationService.notAffter('startDate', 'endDate', 'organizationcontroller.table.to.date')]);
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
        this.rewardTypeListByUser = this.rewardType.filter((item) => {
          return res.includes(item.id)
        })
    })
  }

  get f() {
    return this.formSearch.controls;
  }

  public prepareSaveOrUpdate(item) {
    if (item && item.rewardProposeId > 0) {
      this.rewardProposeService.findOne(item.rewardProposeId).subscribe(res => {
        if (res.data != null) {
          this.router.navigate(['/reward/reward-propose/edit/', item.rewardProposeId]);
        } else {
          this.processSearch();
          return;
        }
      });
    } else {
      this.router.navigate(['/reward/reward-propose/add']);
    }
  }

  public processView(item) {
    this.rewardProposeService.findOne(item.rewardProposeId)
      .subscribe(res => {
        if (res.data != null) {
          this.router.navigate(['/reward/reward-propose/view/', item.rewardProposeId]);
        } else {
          this.processSearch();
          return;
        }
      });
  }

  /**
  * gửi xét duyệt
  */
   public prepareSendApproval(item) {
    this.app.confirmMessage(null, () => { // on accepted
      this.rewardProposeService.updateStatus({ rewardProposeId: item.rewardProposeId, status: 4, note: null, signOrgId: item.signOrgId })
        .subscribe(res => {
          if (res.data != null) {
            this.processSearch(null);
          }
          else {
            this.processSearch();
            return;
          }
        });
    }, () => {
      // on rejected
    });
  }

  public processDelete(item) {
    if (item && item.rewardProposeId > 0) {
      this.rewardProposeService.findOne(item.rewardProposeId)
        .subscribe(res => {
          if (res.data != null) {
            this.app.confirmDelete(null, () => { // accept
              this.rewardProposeService.deleteById(item.rewardProposeId)
                .subscribe(res => {
                  if (this.rewardProposeService.requestIsSuccess(res)) {
                    this.processSearch(null);
                  }
                })
            }, () => {
              // rejected
            })
          } else {
            this.processSearch();
            return;
          }
        })
    }
  }

  /**
   * export
   */
  public processExport() {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    const credentials = Object.assign({}, this.formSearch.value);
    const searchData = CommonUtils.convertData(credentials);
    const params = CommonUtils.buildParams(searchData);
    this.rewardProposeService.exportRewardPropose(params).subscribe(res => {
      saveAs(res, 'de_xuat_khen_thuong.xlsx');
    });
  }
  //Thực hiện trình ký dề xuất khen thưởng.
  public actionSignVoffice(item) {
    // thực hiện gen file phụ lục trình ký
    this.rewardProposeService.actionSignVoffice(item.rewardProposeId).subscribe(res => {
      if(this.rewardProposeService.requestIsSuccess(res)) {
        const signDocumentId = res.data;
        this.router.navigateByUrl('voffice-signing/reward-propose/' + signDocumentId, { state: {backUrl:'reward/reward-propose'} });
      }
    })
  }
  async viewVofficeFile(item) {
    const modalRef = this.modalService.open(VofficeSigningPreviewModalComponent, {size: 'lg',backdrop: 'static',windowClass: 'modal-xxl2',keyboard: false});
    modalRef.componentInstance.id = item.signDocumentId;
  }
  //export file phụ lục
  public exportFileSignVoffice(item) {
    if (item.fromSource == 1) {
      this.rewardProposeService.exportSignVofficeObject(item.rewardProposeId).subscribe(res => {
        saveAs(res, "QĐ_Danh_sach_chi_tiet_khen_thuong.xls");
      });
    } else {
      this.rewardProposeService.exportSignVofficeObject(item.rewardProposeId).subscribe(res => {
        saveAs(res, "QĐ_Danh_sach_chi_tiet_khen_thuong1.xls");
      })
    }
  }

  cancelSignReward2(item: any) {
    this.app.confirmMessage('resolutionsMonth.cancelStream',
      () => {
        this.signDocumentService.cancelTransaction('reward-propose', item.signDocumentId)
          .subscribe(res => {
            this.app.successMessage('cancelSign.success');
            this.processSearch();
          })
      }, () =>  {
         // on rejected
      });
    };

  public actionShowHistory(item) {
    if (item.signDocumentId == null || item.status == 1) {
      return;
    }
    const modalRef = this.modalService.open(ApprovalHistoryModalComponent, DEFAULT_MODAL_OPTIONS);
    modalRef.componentInstance.signDocumentId = item.signDocumentId;
  }

  public syncSign(item:any) {
    this.signDocumentService.syncSign(item.transCode)
      .subscribe(res => {
        this.app.successMessage('voffice.success');
      this.processSearch();
    })
  }
}
