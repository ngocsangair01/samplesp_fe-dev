import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, APP_CONSTANTS, DEFAULT_MODAL_OPTIONS, FROM_SOURCE, LARGE_MODAL_OPTIONS, OrganizationService, PROPOSE_SIGN_STATUS, SELECTION_STATUS } from '@app/core';
import { AppParamService } from '@app/core/services/app-param/app-param.service';
import { HrStorage } from '@app/core/services/HrStorage';
import { RewardProposeSignService } from '@app/core/services/reward-propose-sign/reward-propose-sign.service';
import { SignDocumentService } from '@app/core/services/sign-document/sign-document.service';
import { VofficeSigningPreviewModalComponent } from '@app/modules/voffice-signing/preview-modal/voffice-signing-preview-modal.component';
import { ApprovalHistoryModalComponent } from '@app/shared/components/approval-history/approval-history.component';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  RewardProposeSignErrorComponent
} from "@app/modules/reward/reward-propose-sign/reward-propose-sign-error/reward-propose-sign-error";
import {DialogService} from "primeng/api";
import {RewardProposeService} from "@app/core/services/reward-propose/reward-propose.service";
import { SelectBudgetDateAndFundCategoryComponent } from '@app/modules/reward/reward-propose-sign/select-budget-date-and-fun-category/select-budget-date-and-funcategory.component';
import {
  SelectBudgetDateComponent
} from "@app/modules/reward/reward-propose-sign/select-budget-date/select-budget-date.component";
import {
  UpdateStatusRewardProposeSign
} from "@app/modules/reward/reward-propose-sign/update-status-reward-propose-sign/update-status-reward-propose-sign";

@Component({
  selector: 'reward-propose-sign-search',
  templateUrl: './reward-propose-sign-search.component.html',
  styleUrls: ['./reward-propose-sign-search.component.css']
})
export class RewardProposeSignSearchComponent extends BaseComponent implements OnInit {
  formSearch: FormGroup;
  rewardProposeSignId: number;
  listStatus: any;
  filterConditionEmp: any;
  periodTypeList: any;
  selectedGop: any;
  signDocumentId: any;
  status: any;
  rewardTypeListByUserToInsert: any;
  lstPeriodType = APP_CONSTANTS.REWARD_PERIOD_TYPE_LIST;
  listYear: any;
  formconfig = {
    rewardProposeSignId: [null],
    name: [null],
    status: [null],
    sapStatementStatus: [null],
    sapStatementNo:[null],
    signOrgId: [null],
    totalAmountOfMoney: [null],
    signOrgName: [null],
    promulgateBy: [""],
    promulgateDateTo: [null],
    promulgateDateFrom: [null],
    approvalOrgId: [null],
    proposeOrgId: [null],
    decisionNumber: [null],
    fromDate: [null],
    toDate: [null],
    rewardType: [null],
    isName: [false],
    isStatus: [false],
    isSignOrgId: [false],
    isPromulgateDateTo: [false],
    isPromulgateDateFrom: [false],
    isApprovalOrgId: [false],
    isProposeOrgId: [false],
    isDecisionNumber: [false],
    isFromDate: [false],
    isToDate: [false],
    periodType: [null],
    proposeYear: [null],
    isPeriodType: [false],
    isProposeYear: [false],
    updateReasonDescription:[null],
  }
  isMasO: boolean = false;
  isPartyO: boolean = false;
  isOrg: boolean = false;
  isSelectedRewardType: boolean = true;
  branch: number;
  mapRewardTypeBranch = { 1: 0, 2: 3, 3: 1, 4: 2, 5: 5 };
  lstRewardType = APP_CONSTANTS.REWARD_GENERAL_TYPE_LIST;
  private operationKey = 'action.view';
  private adResourceKey = 'resource.rewardPropose';
  private defaultDomain: any;
  promulgateBy: any;

  constructor(
    private rewardProposeSignService: RewardProposeSignService,
    private app: AppComponent,
    private router: Router,
    private service: OrganizationService,
    private modalService: NgbModal,
    private signDocumentService: SignDocumentService,
    private rewardProposeService: RewardProposeService,
    public dialogService: DialogService,
    private appParamService: AppParamService,
  ) {
    super(null, CommonUtils.getPermissionCode("resource.rewardPropose"));
    this.listStatus = APP_CONSTANTS.PROPOSE_SIGN_LIST_STATUS;
    this.setMainService(rewardProposeSignService);
    this.formSearch = this.buildForm({}, this.formconfig, ACTION_FORM.VIEW, [
      ValidationService.notAffter('promulgateDateFrom', 'promulgateDateTo', 'rewardProposeSign.promulgateDateTo')]);
    this.formSearch = this.buildForm({}, this.formconfig, ACTION_FORM.VIEW, [
      ValidationService.notAffter('startDate', 'endDate', 'organizationcontroller.table.to.date')]);
    this.periodTypeList = APP_CONSTANTS.REWARD_PERIOD_TYPE_LIST;
    this.formSearch = this.buildForm({}, this.formconfig, ACTION_FORM.VIEW, [
      ValidationService.notAffter('fromDate', 'toDate', 'common.label.toDate')]);
  }

  ngOnInit() {
    this.listYear = this.getYearList()
    //Lấy miền dữ liệu mặc định theo nv đăng nhập
    this.rewardProposeService.getRewardTypeList().subscribe(res => {
      this.rewardTypeListByUserToInsert = this.lstRewardType.filter((item) => {
        return res.includes(item.id)
      })
    });
    this.defaultDomain = HrStorage.getDefaultDomainByCode(CommonUtils.getPermissionCode(this.operationKey)
      , CommonUtils.getPermissionCode(this.adResourceKey));
    // search
      this.processSearch();
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

  get f() {
    return this.formSearch.controls;
  }

  public prepareSaveOrUpdate(item?: any) {
    if (item && item.rewardProposeSignId > 0) {
      this.rewardProposeSignService.findOne(item.rewardProposeSignId).subscribe(res => {
        if (res.data != null && res.data.fromSource == FROM_SOURCE.QD_DE_XUAT) {
          this.router.navigate(['/reward/reward-propose-sign/edit-sign/', item.rewardProposeSignId]);
        } else if (res.data != null && res.data.fromSource == FROM_SOURCE.QD_NGOAI) {
          this.router.navigate(['/reward/reward-propose-sign/decided-sign-outside/edit-decision/', item.rewardProposeSignId]);
        } else {
          this.processSearch();
          return;
        }
      });
    } else {
      this.router.navigate(['/reward/reward-propose-sign/add-sign']);
    }
  }

  public decision() {
    this.router.navigate(['/reward/reward-propose-sign/decided-sign-outside/add-decided']);
  }

  public exportTemplate(item) {
    if (item.fromSource == 1) {
      this.rewardProposeSignService.exportRewardProposeSignObject(item.rewardProposeSignId).subscribe(res => {
        saveAs(res, 'DanhSachDoiTuongKhenThuong.xls');
      });
    } else {
      this.rewardProposeSignService.exportProposeSignObject(item.rewardProposeSignId).subscribe(res => {
        saveAs(res, 'DanhSachDoiTuongKhenThuong1.xls');
      });
    }
  }

  public transferBTHTT(item) {
    this.app.confirmMessage("app.rewardBTHTT.confirmHasNotPermission", () => { // accept
      this.rewardProposeSignService.processTransferBTHTT(item.rewardProposeSignId)
          .subscribe(res => {
            if (this.rewardProposeSignService.requestIsSuccess(res)) {
              this.app.successMessage('reimbursement.success');
              this.processSearch(null);
            }
            else{
              const ref = this.dialogService.open(RewardProposeSignErrorComponent, {
                header: 'Thông báo lỗi',
                width: '50%',
                baseZIndex: 2000,
                contentStyle: {"padding": "0"},
                data: {
                  errorSAP: res.data
                }
              });
              // this.app.errorMessage('reimbursement.error', res.data);
            }
          })
    }, () => {
      // rejected
    })
  }

  public transferPayment(item) {
    const modalRef = this.modalService.open(SelectBudgetDateAndFundCategoryComponent, {windowClass:'dialog-xl slide-in-right', backdrop: 'static'});
    const formSearch = {
      proposeOrgId: null,
      rewardProposeSignId: item.rewardProposeSignId           
    };
    const data = { formSearch: formSearch};
    if (data) {
      modalRef.componentInstance.setFormValue(this.propertyConfigs, data);
    }
    modalRef.result.then((result) => {
      if (!result) {
        return;
      }
      
    });
 
    // this.app.confirmMessage("app.rewardPayment.confirmHasNotPermission", () => { // accept
    //   this.rewardProposeSignService.processTransferPayment(item.rewardProposeSignId)
    //       .subscribe(res => {
    //         if (this.rewardProposeSignService.requestIsSuccess(res)) {
    //           this.app.successMessage('createReimbursement.success');
    //           this.processSearch(null);
    //         }
    //         else{
    //           const ref = this.dialogService.open(RewardProposeSignErrorComponent, {
    //             header: 'Thông báo lỗi',
    //             width: '50%',
    //             baseZIndex: 2000,
    //             contentStyle: {"padding": "0"},
    //             data: {
    //               errorSAP: res.data
    //             }
    //           });
    //           // this.app.errorMessage('reimbursement.error', res.data);
    //         }
    //       })
    // }, () => {
    //   // rejected
    // })
  }
  public validateTransferBTHTT(item){
    if(item == null){
      return false;
    }
    return [0,4].includes(item.paymentStatus) && item.status == 3;
  }
  public validateCancelProposeSign(item){
    if(item == null){
      return true;
    }
    return [0,1,3].includes(item)
  }
  public processView(item?: any) {
    this.rewardProposeSignService.findOne(item.rewardProposeSignId)
      .subscribe(res => {
        if (res.data != null && res.data.fromSource == FROM_SOURCE.QD_DE_XUAT) {
          this.router.navigate(['/reward/reward-propose-sign/view-sign/', item.rewardProposeSignId]);
        } else if (res.data != null && res.data.fromSource == FROM_SOURCE.QD_NGOAI) {
          this.router.navigate(['/reward/reward-propose-sign/decided-sign-outside/view-decision/', item.rewardProposeSignId]);
        } else {
          this.processSearch();
          return;
        }
      });
  }

  public processDelete(item) {
    if (item && item.rewardProposeSignId > 0) {
      this.rewardProposeSignService.findOne(item.rewardProposeSignId).subscribe(res => {
        if (res.data != null) {
          this.app.confirmDelete(null, () => { // accept
            this.rewardProposeSignService.deleteById(item.rewardProposeSignId)
              .subscribe(res => {
                if (this.rewardProposeSignService.requestIsSuccess(res)) {
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
      });
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
    this.rewardProposeSignService.exportRewardProposeSign(params).subscribe(res => {
      saveAs(res, 'danh_sach_trinh_ky_khen_thuong.xlsx');
    });
  }

  /**
   * Trinh ky
   * @param item
   */
  prepareSign(item) {
    // thực hiện gen file phụ lục trình ký
    this.rewardProposeSignService.actionSignVoffice(item.rewardProposeSignId).subscribe(res => {
      if(this.rewardProposeSignService.requestIsSuccess(res)) {
        const signDocumentId = res.data;
        this.router.navigateByUrl('voffice-signing/reward-propose-sign/' + signDocumentId, { state: {backUrl:'reward/reward-propose-sign'} });
      }
    })
  }

  previewFileSigning(signDocumentId) {
    const modalRef = this.modalService.open(VofficeSigningPreviewModalComponent, {size: 'lg',backdrop: 'static',windowClass: 'modal-xxl2',keyboard: false
    });
    modalRef.componentInstance.id = signDocumentId;
  }

  public confirmation(item) {
    this.app.confirmMessage(null, () => { // on accepted
      this.rewardProposeSignService.updateStatus({rewardProposeSignId: item.rewardProposeSignId, status: PROPOSE_SIGN_STATUS.DU_THAO, signOrgId: item.signOrgId })
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

  public cancel(item) {
    this.app.confirmMessage(null, () => { // on accepted
      this.rewardProposeSignService.updateStatus({
        rewardProposeSignId: item.rewardProposeSignId,
        status: PROPOSE_SIGN_STATUS.HUY_QUYET_DINH,
        signOrgId: item.signOrgId
      })
        .subscribe(res => {
          if (res.type === 'SUCCESS' || res.type === 'success') {
            this.app.successMessage("Hủy quyết định thành công.");
            this.processSearch(null);
            location.reload();
          } else {
            const ref = this.dialogService.open(RewardProposeSignErrorComponent, {
              header: 'Thông báo lỗi',
              width: '50%',
              baseZIndex: 2000,
              contentStyle: { "padding": "0" },
              data: {
                errorSAP: res.code
              }
            });
          }


        });
    }, () => {
      // on rejected
    });
  }

  public genData(event: any) {
    if (event && event.codeField) {
      this.promulgateBy = event.codeField;
      this.f['promulgateBy'].patchValue(this.promulgateBy);
    } else {
      this.f['promulgateBy'].patchValue("");
    }
  }

  processSearch(event?) {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    let param = { ...this.formSearch.value };
    this.rewardProposeSignService.search(param, event).subscribe(res => {
      this.resultList = res;
    });
    if (!event) {
      if (this.dataTable) {
        this.dataTable.first = 0;
      }
    }
  }

  cancelSignReward(item: any) {
    this.app.confirmMessage('resolutionsMonth.cancelStream',
      () => {
        this.signDocumentService.cancelTransaction('reward-propose-sign',item.signDocumentId)
          .subscribe(res => {
            this.app.successMessage('cancelSign.success');
            this.processSearch();
          })
      }, () => {
         // on rejected
       });
  }

  public actionShowHistory(item) {
    if (item.signDocumentId == null || item.status == 1 || item.fromSource == 2) {
      return;
    }
    const modalRef = this.modalService.open(ApprovalHistoryModalComponent, DEFAULT_MODAL_OPTIONS);
    modalRef.componentInstance.signDocumentId = item.signDocumentId;
  }

  public syncSign(item:any) {
    this.signDocumentService.syncSign(item.transCode).subscribe(res => {
      if (this.appParamService.requestIsSuccess(res)) {
        this.app.successMessage('voffice.success');
        this.processSearch();
      }
    })
  }
  public onRewardTypeChange() {
    const rewardType = this.formSearch.controls['rewardType'].value;
    const branch = this.mapRewardTypeBranch[rewardType];
    this.isPartyO = false;
    this.isMasO = false;
    this.isOrg = false;
    this.isSelectedRewardType = false;
    this.branch = branch;
    if (rewardType == 1) {
      this.isOrg = true;
    } else if (rewardType == 5) {
      this.isPartyO = true;
    } else if (rewardType == null) {
      this.isSelectedRewardType = true;
    } else {
      this.isMasO = true;
    }
    this.formSearch.removeControl('proposeOrgId');
    this.formSearch.removeControl('approvalOrgId');
    this.formSearch.removeControl('signOrgId');
    this.formSearch.addControl('proposeOrgId', new FormControl(null))
    this.formSearch.addControl('approvalOrgId', new FormControl(null))
    this.formSearch.addControl('signOrgId', new FormControl(null))
  }

  callJobGenFile(){
    this.rewardProposeSignService.callJobGenFile()
        .subscribe(res => {
          console.log("res: ", res);
        })
  }

  updateStatusRewardProposeSign(rewardProposeSign: any){
    const modalRef = this.modalService.open(UpdateStatusRewardProposeSign, {windowClass:'dialog-xl slide-in-right', backdrop: 'static'});
    modalRef.componentInstance.setRewardProposeSign(rewardProposeSign)
  }
}
