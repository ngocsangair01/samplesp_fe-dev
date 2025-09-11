import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import {ACTION_FORM, APP_CONSTANTS, LARGE_MODAL_OPTIONS, RequestReportService} from '@app/core';
import { Router } from '@angular/router';
import { AppParamService } from '@app/core/services/app-param/app-param.service';
import { AppComponent } from '@app/app.component';
import { DialogService } from 'primeng/api';
import {FileStorageService} from "@app/core/services/file-storage.service";
import { CommonUtils } from '@app/shared/services';
import { WelfarePolicyCategoryService } from '@app/core/services/population/welfare-policy-category.service';
import { WelfarePolicyRequestService } from '@app/core/services/population/welfare-policy-request.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WelfarePolicyProposalService } from '@app/core/services/population/welfare-policy-proposal.service';
import {saveAs} from "file-saver";
import {
  VofficeSigningPreviewModalComponent
} from "@app/modules/voffice-signing/preview-modal/voffice-signing-preview-modal.component";
import {SignDocumentService} from "@app/core/services/sign-document/sign-document.service";
import {
  RewardProposeSignErrorComponent
} from "@app/modules/reward/reward-propose-sign/reward-propose-sign-error/reward-propose-sign-error";
import {
  WelfarePolicyProposalErrorComponent
} from "@app/modules/population/welfare-policy/welfare-policy-proposal/welfare-policy-proposal-error/welfare-policy-proposal-error";
@Component({
  selector: 'welfare-policy-proposal-index',
  templateUrl: './welfare-policy-proposal-index.component.html',
  styleUrls: ['./welfare-policy-proposal-index.component.css']
})
export class WelfarePolicyProposalComponent extends BaseComponent implements OnInit {
  welfarePolicyCategoryList = [];
  receiverTypeOptions
  formConfig = {
    proposalOrgId: [null],
    spendingOrgId: [null],
    receiverType: [null],
    title: [null],
    status: [null],
    sapVOSStatusDes: [null],
    fromCreatedTime: [null],
    toCreatedTime: [null],
    receiverEmployeeId: [null],
    documentState: [null],
    sapSumInvNo: [null],
    sumInvNo: [null],
    sapVoSStatusDes: [null],
    sapStatementNo: [null],
    sapStatementStatus: [null],
    isFromCreatedTime: [false],
    isTitle: [false],
    isStatus: [false],
    iToCreatedTime: [false],
    isProposalOrgId: [false],
    isSpendingOrgId: [false],
    isReceiverEmployeeId: [false],
    isDocumentState: [false],
    isSapSumInvNo: [false],
    isSumInvNo: [false],
    isSapVoSStatusDes: [false],
  }
  statusList = [
    { name: 'Dự thảo', value: 0 },
    { name: 'Chờ ký duyệt', value: 1 },
    { name: 'Đã ký duyệt', value: 2 },
    { name: 'Bị từ chối ký', value: 3 },
    { name: 'Hủy đề nghị', value: 6 },
  ]
  sapVoSStatusDesList = [
    { name: '01- Created', value: 1 },
    { name: '02- Changed', value: 2 },
    { name: '03- Submitted to Accounting', value: 3 },
    { name: '04- HR approved', value: 4 },
    { name: '05- HR rejected', value: 5 },
    { name: '06- Accounting approved', value: 6 },
    { name: '07- Accounting rejected', value: 7 },
    { name: '08- Submitted to V-office', value: 8 },
    { name: '09- V-office approved', value: 9 },
    { name: '10- V-office rejected', value: 10 },
    { name: '98- Errors during processing', value: 98 },
    { name: '99- Not yet processed', value: 99 },
    { name: '100- Errors  sent data to SAP', value: 100 },
  ]
  tableColumnsConfig = [
    {
      header: "common.label.table.action",
      width: "50px"
    },
    {
      header: "common.table.index",
      width: "50px"
    },
    {
      name: "title",
      header: "label.welfare.policy.proposal.name",
      width: "200px"
    },
    {
      name: "proposalOrgName",
      header: "label.welfare.policy.proposal.proposalOrg",
      width: "200px"
    },
    {
      name: "spendingOrgName",
      header: "label.welfare.policy.proposal.spendingOrg1",
      width: "200px"
    },
    {
      name: "amountTotal",
      header: "label.welfare.policy.proposal.total",
      width: "200px"
    },
    {
      name: "approveEmployeeName",
      header: "label.welfare.policy.proposal.signer",
      width: "200px"
    },
    {
      name: "approveDate",
      header: "label.welfare.policy.proposal.signedDate",
      width: "200px"
    },
    {
      name: "receiverEmployeeName",
      header: "app.settings.emailSmsDynamic.recipients",
      width: "200px"
    },
    {
      name: "status",
      header: "label.welfare.policy.proposal.status",
      width: "200px"
    },
    {
      name: "rejectReason",
      header: "label.welfare.policy.proposal.rejectReason",
      width: "200px"
    },
    {
      name: "sumInvNo",
      header: "label.welfare.policy.proposal.bthtt",
      width: "200px"
    },
    {
      name: "sapSumInvNo",
      header: "label.welfare.policy.proposal.sapSumInvNo",
      width: "200px"
    },
    {
      name: "sapVoSStatusDes",
      header: "rewardPropose.reimbursement.sapvoSStatusDes",
      width: "200px"
    },
    {
      name: "sapPayOrdStatus",
      header: "label.welfare.policy.proposal.sapPayOrdStatus",
      width: "200px"
    },
    {
      name: "sapStatementNo",
      header: "label.welfare.policy.proposal.sapStatementNo",
      width: "200px"
    },
    {
      name: "sapStatementStatus",
      header: "label.welfare.policy.proposal.sapStatementStatus",
      width: "200px"
    },
    {
      name: "documentCode",
      header: "label.welfare.policy.proposal.documentCode",
      width: "200px"
    }
  ]

  constructor(
    private router: Router,
    private appParamService: AppParamService,
    private requestReportService: RequestReportService,
    private app: AppComponent,
    public dialogService: DialogService,
    private welfarePolicyCategoryService: WelfarePolicyCategoryService,
    private service: WelfarePolicyProposalService,
    private fileStorage: FileStorageService,
    private signDocumentService: SignDocumentService,
    public modalService: NgbModal
  ) {
    super(null, CommonUtils.getPermissionCode("resource.welfarePolicyProposal"));
    this.setMainService(this.service);
  }

  ngOnInit() {
    this.receiverTypeOptions = APP_CONSTANTS.RECEIVER_TYPE;
    this.formSearch = this.buildForm('', this.formConfig, ACTION_FORM.VIEW);
    this.search()
  }

  get f() {
    return this.formSearch.controls;
  }

  navigateToCreatePage() {
    this.router.navigateByUrl('/population/welfare-policy-proposal/create');
  }

  navigateToUpdatePage(rowData?) {
    this.router.navigateByUrl(`/population/welfare-policy-proposal/update/${rowData.welfarePolicyProposalId}`);
  }

  navigateToViewPage(rowData?) {
    this.router.navigateByUrl(`/population/welfare-policy-proposal/view/${rowData.welfarePolicyProposalId}`);
  }

  navigateToActSignPage(rowData?) {
    this.router.navigate([`/voffice-signing/welfare-policy-proposal/`, rowData.signDocumentId]);
  }

  cancelProposal(rowData?){
    this.app.confirmMessage('resolutionsMonth.cancelProposal',
        () => {
          this.service.cancelProposal(rowData.welfarePolicyProposalId).subscribe(res => {
            if (res.type === 'SUCCESS') {
              this.search()
              this.app.successMessage("cancel.proposal","Hủy đề nghị chi thành công.");
            }
          })
        },
        () => { }
    )
  }
  transferPayment(rowData?){
    this.service.transferPayment(rowData.welfarePolicyProposalId).subscribe(res => {
      if (res.data === 'Success') {       
        this.app.successMessage('reimbursement.success');
        this.search()
      }else{
        this.app.errorMessage('','Chuyển thanh toán thất bại: '+res.data);
        const ref = this.dialogService.open(WelfarePolicyProposalErrorComponent, {
          header: 'Thông báo lỗi',
          width: '50%',
          baseZIndex: 2000,
          contentStyle: { "padding": "0" },
          data: {
            errorSAP: res.data
          }
        });
        this.search()
      }
    })
  }

  createPayment(rowData?){
    this.service.createPayment(rowData.welfarePolicyProposalId).subscribe(res => {
      console.log("data",res)
      if (res.data === 'Success') {
        this.app.successMessage('createReimbursement.success');
        this.search()
      }else{
        this.app.errorMessage('','Tạo tờ trình thất bại: '+res.data);
        const ref = this.dialogService.open(WelfarePolicyProposalErrorComponent, {
          header: 'Thông báo lỗi',
          width: '50%',
          baseZIndex: 2000,
          contentStyle: { "padding": "0" },
          data: {
            errorSAP: res.data
          }
        });
        this.search()
      }
    })
  }

  transferAttachFile(rowData?){
    this.service.transferFileAttach(rowData.welfarePolicyProposalId).subscribe(res => {
      if (res.data === 'Success') {       
        this.app.successMessage('transfer.attach.file');
        this.search()
      }else{
        this.app.errorMessage('','Chuyển thanh toán thất bại: '+res.data);
        this.search()
      }
    })
  }

  public downloadDataInList(item: any) {
    if (item && item.welfarePolicyProposalId) {
      this.service.downloadDataInList(item.welfarePolicyProposalId).subscribe(res => {
        saveAs(res, 'T02-BQTDL_De nghi chi tham hoi.xlsx');
      });
    }
  }

  search(event?) {
    this.service.search(this.formSearch.value, event).subscribe(res => {
      this.resultList = res;
    });
  }

  deleteWelfarePolicyProposal(rowData) {
    this.app.confirmDelete(null,
      () => {
        this.service.deleteById(rowData.welfarePolicyProposalId)
          .subscribe(res => {
              this.search();
          })
      },
      () => { }
    )
  }

  previewFileSigning(rowData) {
    const modalRef = this.modalService.open(VofficeSigningPreviewModalComponent, LARGE_MODAL_OPTIONS);
    modalRef.componentInstance.id = rowData.signDocumentId;
    modalRef.componentInstance.transCode = rowData.transCode;
  }

  syncSign(item: any) {
    this.signDocumentService.syncSign(item.transCode)
        .subscribe(res => {
          if (this.appParamService.requestIsSuccess(res)) {
            this.app.successMessage('voffice.success');
            this.search();
          }
        })
  }

  cancelSign(item) {
    if (item && item.signDocumentId > 0) {
      this.app.confirmMessage('resolutionsMonth.cancelStream', () => { // on accepted
        this.signDocumentService.cancelStream('welfare-policy-proposal', item.signDocumentId)
            .subscribe(res => {
              if (this.signDocumentService.requestIsSuccess(res)) {
                this.search();
              }
            });
      }, () => {
        // on rejected
      });
    }
  }
  cancelPayment(item) {
    if (item && item.welfarePolicyProposalId > 0) {
      this.app.confirmMessage('resolutionsMonth.cancelPayment', () => { // on accepted
        this.service.cancelPayment(item.welfarePolicyProposalId)
            .subscribe(res => {
              if(res.data == "Success") {
                if (this.signDocumentService.requestIsSuccess(res)) {
                  this.search();
                }
                this.app.successMessage('cancelPayment.success');
              }
              else {
                this.app.errorMessage('','Chuyển thanh toán thất bại: '+res.data);
              }
            });
      }, () => {
        // on rejected
      });
    }
  }

}
