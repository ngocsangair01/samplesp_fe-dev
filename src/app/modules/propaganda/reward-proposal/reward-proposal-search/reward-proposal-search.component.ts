import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, APP_CONSTANTS, DEFAULT_MODAL_OPTIONS, LARGE_MODAL_OPTIONS, OrganizationService } from '@app/core';
import { HrStorage } from '@app/core/services/HrStorage';
import { RewardProposalService } from '@app/core/services/propaganda/reward-proposal.service';
import { SignDocumentService } from '@app/core/services/sign-document/sign-document.service';
import { VofficeSigningPreviewModalComponent } from '@app/modules/voffice-signing/preview-modal/voffice-signing-preview-modal.component';
import { ApprovalHistoryModalComponent } from '@app/shared/components/approval-history/approval-history.component';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'reward-proposal-search',
  templateUrl: './reward-proposal-search.component.html'
})
export class RewardProposalSearchComponent extends BaseComponent implements OnInit {
  propagandaRewardProposalId: number;
  rewardTypeList: any;
  rewardStatusList: any;
  formSearch: FormGroup;
  private operationKey = 'action.view';
  private adResourceKey = 'resource.propaganda';
  defaultDomain: any;
  formConfig = {
    organizationId: [''],
    status: [''],
    employeeId: [''],
    rewardProposalCode: ['', [ValidationService.maxLength(100)]],
    rewardProposalType: [''],
    documentNumber: ['', [ValidationService.maxLength(100)]],
    proposalFromDate: [''],
    proposalToDate: [''],
    documentCode: [null],
    startDate: [null],
    endDate: [null]
  };

  constructor(public actr: ActivatedRoute
    , private router: Router
    , private app: AppComponent
    , private rewardProposalService: RewardProposalService
    , private service: OrganizationService
    , private signDocumentService: SignDocumentService
    , private modalService: NgbModal) {
    super(null, CommonUtils.getPermissionCode("resource.propaganda"));
    this.setMainService(rewardProposalService);
    this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW,
      [ValidationService.notAffter('proposalFromDate', 'proposalToDate', 'common.label.toDate')]);
    this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW,
      [ValidationService.notAffter('startDate', 'endDate', 'common.label.toDate')]);
    this.rewardStatusList = APP_CONSTANTS.REWARD_STATUS_LIST;
    this.rewardTypeList = APP_CONSTANTS.REWARD_TYPE_LIST;
  }

  ngOnInit() {
    //Lấy miền dữ liệu mặc định theo nv đăng nhập
    this.defaultDomain = HrStorage.getDefaultDomainByCode(CommonUtils.getPermissionCode(this.operationKey)
      , CommonUtils.getPermissionCode(this.adResourceKey));
    if (this.defaultDomain) {
      this.service.findOne(this.defaultDomain)
        .subscribe((res) => {
          const data = res.data;
          if (data) {
            this.f['organizationId'].setValue(data.organizationId);
          }
          this.processSearch();
        });
    } else {
      this.processSearch();
    }
  }

  get f() {
    return this.formSearch.controls;
  }

  public prepareSaveOrUpdate(item?: any) {
    if (item && item.propagandaRewardProposalId > 0) {
      this.router.navigate(['/propaganda/reward-proposal-edit/', item.propagandaRewardProposalId]);
    } else {
      this.router.navigate(['/propaganda/reward-proposal-add']);
    }
  }

  public preparView(item?: any) {
    this.router.navigate(['/propaganda/reward-proposal/', item.propagandaRewardProposalId, 'view']);
  }
  /**
   * Xoa to trinh
   * @param item 
   */
  processDelete(item) {
    if (item && item.propagandaRewardProposalId > 0) {
      this.app.confirmDelete(null, () => {// on accepted
        this.rewardProposalService.deleteById(item.propagandaRewardProposalId)
          .subscribe(res => {
            if (this.rewardProposalService.requestIsSuccess(res)) {
              this.processSearch(null);
            }
          });
      }, () => {// on rejected
      });
    }
  }

  /**
   * Trinh ky
   * @param item 
   */
  prepareSign(item) {
    if (item && item.signDocumentId > 0) {
      this.router.navigate(['/voffice-signing/reward-proposal/', item.signDocumentId]);
    }
  }

  /**
   * Action hủy trình ký
   * @param signDocumentId
   */
   cancelSignrewardproposal(item: any) {
    this.app.confirmMessage('resolutionsMonth.cancelStream',
      () => {
        this.signDocumentService.cancelTransaction('reward-proposal', item.signDocumentId)
          .subscribe(res => {
            this.app.successMessage('cancelSign.success');
            this.processSearch();
        });
      }, () => {
        // on rejected
      });
  }

  public processExport() {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    const credentials = Object.assign({}, this.formSearch.value);
    const searchData = CommonUtils.convertData(credentials);
    const params = CommonUtils.buildParams(searchData);
    this.rewardProposalService.export(params).subscribe(res => {
      saveAs(res, 'to_trinh_khen_thuong.xlsx');
    });
  }

  previewFileSigning(signDocumentId) {
    const modalRef = this.modalService.open(VofficeSigningPreviewModalComponent, LARGE_MODAL_OPTIONS);
    modalRef.componentInstance.id = signDocumentId;
  }

  /**
   * Action xem lịch sử trình ký
   * @param item
   * @return
   */
  actionShowHistorySigning(item) {
    if (item.signDocumentId == null || item.status == 0) {
      return;
    } 
    const modalRef = this.modalService.open(ApprovalHistoryModalComponent, DEFAULT_MODAL_OPTIONS);
    modalRef.componentInstance.signDocumentId = item.signDocumentId;
  }
}
