import { Component, NgModuleRef, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, APP_CONSTANTS, DEFAULT_MODAL_OPTIONS, LARGE_MODAL_OPTIONS ,MEDIUM_MODAL_OPTIONS} from '@app/core';
import { TransferPartyMemberService } from '@app/core/services/party-organization/transfer-party-member.service';
import { CategoryService } from '@app/core/services/setting/category.service';
import { SignDocumentService } from '@app/core/services/sign-document/sign-document.service';
import { SysCatService } from '@app/core/services/sys-cat/sys-cat.service';
import { VofficeSigningPreviewModalComponent } from '@app/modules/voffice-signing/preview-modal/voffice-signing-preview-modal.component';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TransferPartyMemberAcceptComponent } from '../transfer-party-member-accept/transfer-party-member-accept.component';
import { TransferPartyMemberConfirmCancelComponent } from '../transfer-party-member-confirm-cancel/transfer-party-member-confirm-cancel.component';
import { TransferPartyMemberConfirmComponent } from '../transfer-party-member-confirm/transfer-party-member-confirm.component';
import { TransferPartyMemberHistoryComponent } from '../transfer-party-member-history/transfer-party-member-history.component';
import { ApprovalHistoryModalComponent } from '@app/shared/components/approval-history/approval-history.component';

@Component({
  selector: 'transfer-party-member-search',
  templateUrl: './transfer-party-member-search.component.html',
  styleUrls: ['./transfer-party-member-search.component.css']
})
export class TransferPartyMemberSearchComponent extends BaseComponent implements OnInit {
  partyTypeList: any;
  statusList = APP_CONSTANTS.TRANSFER_PARTY_MEMBER_STATUS;
  transferTypeList = APP_CONSTANTS.TRANSFER_PARTY_MEMBER_TYPE;
  conditionPartyMember: string;
  isMobileScreen: boolean = false;
  formSearch: FormGroup;
  formConfig = {
    partyOrganizationId: ['', []],
    transfer_type: ['', []],
    employeeId: ['', []],
    transferType: [''],
    status: [''],
    createdDate: [''],
    toCreatedDate: [''],
    documentCode: [null],
    startDate: [null],
    endDate: [null],

    isDocumentCode: [false],
    isStartDate: [false],
    isEndDate: [false],
    isCreatedDate: [false],
    isToCreatedDate: [false],
    isTransferType: [false],
    isStatus: [false],
    isPartyOrganizationId: [false],
    isEmployeeId: [false],
  };
  isJobActive: [false];

  constructor(
    private transferPartyMemberService: TransferPartyMemberService,
    private modalService: NgbModal,
    public sysCatService: SysCatService,
    public categoryService: CategoryService,
    private router: Router,
    private app: AppComponent,
    private signDocumentService: SignDocumentService
  ) {
    super(null, CommonUtils.getPermissionCode("resource.transferPartyMember"));
    this.setMainService(transferPartyMemberService);
    this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW,
      [ValidationService.notAffter('createdDate', 'toCreatedDate', 'transferPartyMembers.toDate')]);
    this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW,
      [ValidationService.notAffter('startDate', 'endDate', 'organizationcontroller.table.to.date')]);
    this.checkJobActive();
    this.processSearch();
    this.statusList
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
  }

  ngOnInit() {
  }

  get f() {
    return this.formSearch.controls;
  }

  public prepareSaveOrUpdate(item?: any) {
    if (item && item.transferPartyMemberId > 0) {
      if (item.transferPartyMemberId > 0) {
        this.transferPartyMemberService.findOne(item.transferPartyMemberId)
          .subscribe(res => {
            if (res.data != null) {
              this.router.navigate(['/party-organization/transfer-party-member-edit/', item.transferPartyMemberId]);
            }
          });
      }
    } else {
      this.router.navigate(['/party-organization/transfer-party-member-add']);
    }
  }

  public transferPartyMemberWarning(item?: any) {
      this.router.navigate(['/party-organization/transfer-party-member-warning']);
  }

  /**
   * Hàm xem chi tiết
   * @param item
   */
  public prepareView(item) {
    if (!item) {
      return;
    }
    this.router.navigate(['/party-organization/transfer-party-member-view/', item.transferPartyMemberId, 'view']);
  }

  // Phê duyệt
  public actionApproved(item) {
    if (!item) {
      return;
    }

    if (item.transferPartyMemberId != null) {
      const modalRef = this.modalService.open(TransferPartyMemberConfirmComponent, MEDIUM_MODAL_OPTIONS);
      modalRef.componentInstance.transferPartyMemberId = item.transferPartyMemberId;
      modalRef.componentInstance.employeeName = item.employeeName;
      modalRef.componentInstance.employeeId = item.employeeId;
      modalRef.componentInstance.isApprove = true;
      modalRef.componentInstance.isLastApprove = item.isLastApprove == "1" ? true : false;
      modalRef.componentInstance.partyOrgId = item.partyOrgId;
      modalRef.componentInstance.partyType = item.partyType;
      modalRef.result.then((result) => {
        if (!result) {
          return;
        }
        if (this.transferPartyMemberService.requestIsSuccess(result)) {
          this.processSearch(this.transferPartyMemberService.credentials._search);
        }
      });
    }
  }

  // Tiếp nhận
  public actionAccept(item) {
    this.app.confirmMessage('transferPartyMembers.confirmAccept', () => { // on accepted
      this.transferPartyMemberService.actionAccept({ transferPartyMemberId: item.transferPartyMemberId }).subscribe(res => {
        if (this.transferPartyMemberService.requestIsSuccess(res)) {
          this.processSearch(this.transferPartyMemberService.credentials._search);
        }
      });
      // });
    }, () => {
      // on rejected
    });
  }

  // Từ chối
  public actionUnApproved(item) {
    if (!item) {
      return;
    }
    if (item.transferPartyMemberId != null) {
      const modalRef = this.modalService.open(TransferPartyMemberConfirmComponent, DEFAULT_MODAL_OPTIONS);
      modalRef.componentInstance.transferPartyMemberId = item.transferPartyMemberId;
      modalRef.componentInstance.employeeName = item.employeeName;
      modalRef.componentInstance.isApprove = false;
      modalRef.result.then((result) => {
        if (!result) {
          return;
        }
        if (this.transferPartyMemberService.requestIsSuccess(result)) {
          this.processSearch(this.transferPartyMemberService.credentials._search);
        }
      });
    }
  }

  // Phe duyet nghi viec
  public actionRetired(item) {
    if (!item) {
      return;
    }
    this.app.confirmMessage('transferPartyMembers.confirmRetired', () => { // on accepted
      this.transferPartyMemberService.retired({ transferPartyMemberId: item.transferPartyMemberId }).subscribe(res => {
        if (this.transferPartyMemberService.requestIsSuccess(res)) {
          this.processSearch(this.transferPartyMemberService.credentials._search);
        }
      });
      // });
    }, () => {
      // on rejected
    });
  }

  // Xem lich su
  public actionShowHistory(item) {
    if (!item) {
      return;
    }
    if (item.transferPartyMemberId != null) {
      const modalRef = this.modalService.open(TransferPartyMemberHistoryComponent, DEFAULT_MODAL_OPTIONS);
      modalRef.componentInstance.transferPartyMemberId = item.transferPartyMemberId;
      modalRef.componentInstance.employeeName = item.employeeName;
    }
  }

  // huy luong
  actionCancelStream(item) {
    if (!item) {
      return;
    }
    if (item.transferPartyMemberId != null) {
      const modalRef = this.modalService.open(TransferPartyMemberConfirmCancelComponent, DEFAULT_MODAL_OPTIONS);
      modalRef.componentInstance.transferPartyMemberId = item.transferPartyMemberId;
      modalRef.componentInstance.employeeName = item.employeeName;

      modalRef.result.then((result) => {
        if (!result) {
          return;
        }
        if (this.transferPartyMemberService.requestIsSuccess(result)) {
          this.processSearch(this.transferPartyMemberService.credentials._search);
        }
      });
    }
  }

  processDelete(item) {
    if (item && item.transferPartyMemberId > 0) {
      this.app.confirmDelete(null, () => {
        this.transferPartyMemberService.deleteById(item.transferPartyMemberId)
          .subscribe(res => {
            if (this.transferPartyMemberService.requestIsSuccess(res)) {
              this.processSearch(null);
            }
          });
      })
    };
  }

  public export() {
    const reqData = this.formSearch.value;
    this.app.isProcessing(true);
    this.transferPartyMemberService.export(reqData)
      .subscribe((res) => {
        this.app.isProcessing(false);
        if (res.type === 'application/json') {
          const reader = new FileReader();
          reader.addEventListener('loadend', (e) => {
            const text = e.srcElement['result'];
            const json = JSON.parse(text);
            this.transferPartyMemberService.processReturnMessage(json);
          });
          reader.readAsText(res);
        } else {
          saveAs(res, 'Danh_sach_chuyen_sinh_hoat_Dang.xls');
        }
      });
  }

  public actionViewAccept(item) {
    if (!item) {
      return;
    }
    if (item.transferPartyMemberId != null) {
      const modalRef = this.modalService.open(TransferPartyMemberAcceptComponent, DEFAULT_MODAL_OPTIONS);
      modalRef.componentInstance.transferPartyMemberId = item.transferPartyMemberId;

      modalRef.result.then((result) => {
        if (!result) {
          return;
        }
        if (this.transferPartyMemberService.requestIsSuccess(result)) {
          this.processSearch(this.transferPartyMemberService.credentials._search);
        }
      });
    }
  }

  prepareSign(item) {
    if (item && item.signDocumentId > 0) {
      this.router.navigate(['/sign-manager/transfer-party-member', item.signDocumentId]);
    }
  }

  /**
   * Action xem file trước khi trình ký
   * @param signDocumentId
   */
   previewFileSigning(signDocumentId) {
    const modalRef = this.modalService.open(VofficeSigningPreviewModalComponent, LARGE_MODAL_OPTIONS);
    modalRef.componentInstance.id = signDocumentId;
  }

  /**
   * Action hủy trình ký
   * @param signDocumentId
   */
  cancelSignTransferPartyMember(rowData: any) {
    this.app.confirmMessage('resolutionsMonth.cancelStream',
      () => {
        this.signDocumentService.cancelTransaction('transfer-party-member', rowData.signDocumentId)
          .subscribe(res => {
            this.app.successMessage('cancelSign.success');
            this.processSearch();
        });
      }, () => {
        // on rejected
      });
  }


  /**
   * Action xem lịch sử trình ký
   * @param item 
   * @returns 
   */
  actionShowHistorySigning(item) {
    if (item.signDocumentId == null || item.signStatus == 0) {
      return;
    } 
    const modalRef = this.modalService.open(ApprovalHistoryModalComponent, DEFAULT_MODAL_OPTIONS);
    modalRef.componentInstance.signDocumentId = item.signDocumentId;
  }
 
  /**
   * Action Đồng bộ VO
   * @param item 
   */
  syncSign(item: any) {
    this.signDocumentService.syncSign(item.transCode)
      .subscribe(res => {
        this.app.successMessage('voffice.success');
      this.processSearch();
    })
  }

  checkJobActive(){
    this.transferPartyMemberService.checkJobActive()
        .subscribe(res => {
            this.isJobActive = res;
        })
  }

  callJobTransfer(){
    this.transferPartyMemberService.callJobTransfer()
        .subscribe(res => {
          console.log("res: ", res);
      })
    }
}
