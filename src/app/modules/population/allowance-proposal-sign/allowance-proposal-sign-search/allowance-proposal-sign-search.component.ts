import {Component, OnInit} from '@angular/core';
import {BaseComponent} from "@app/shared/components/base-component/base-component.component";
import {Router} from "@angular/router";
import {AppComponent} from "@app/app.component";
import {APP_CONSTANTS} from "@app/core";
import {AllowancePeriodService} from "@app/core/services/population/allowance-period.service";
import {AllowanceProposalSignService} from "@app/core/services/population/allowance-proposal-sign.service";
import {saveAs} from "file-saver";
import {SignDocumentService} from "@app/core/services/sign-document/sign-document.service";
import { RewardProposeSignService } from '@app/core/services/reward-propose-sign/reward-propose-sign.service';

import { DialogService } from 'primeng/api';
import { AllowanceProposalErrorComponent } from '../allowance-proposal-error/allowance-proposal-error';
import {VfsInvoiceService} from "@app/core/services/vfs-invoice/vfs-invoice.service";
@Component({
    selector: 'allowance-proposal-sign-search',
    templateUrl: './allowance-proposal-sign-search.component.html',
    styleUrls: ['./allowance-proposal-sign-search.component.css']
})
export class AllowanceProposalSignSearchComponent extends BaseComponent implements OnInit {
    formConfig = {
        allowancePeriodId: [null],
        orgType: [null],
        name: [null],
        proposeOrgId: [null],
        approveOrgId: [null],
        allowanceType: [null],
        startYear: [null],
        endYear: [null],
        startPromulgateDate: [null],
        endPromulgateDate: [null],
        decisionNumber: [null],
        status: [null],
        sapStatementStatus: [null],
        isAllowancePeriodId: [false],
        isOrgType: [false],
        isName: [false],
        isProposeOrgId: [false],
        isApproveOrgId: [false],
        isAllowanceType: [false],
        isStartYear: [false],
        isEndYear: [false],
        isStartPromulgateDate: [false],
        isEndPromulgateDate: [false],
        isDecisionNumber: [false],
        isStatus: [false],
    };
    yearList: Array<any>;
    currentDate = new Date();
    branch: number = 0;
    currentYear = this.currentDate.getFullYear();
    orgTypeOptions;
    AllowancePeriodList: any;
    statusList = [
        { name: 'Dự thảo', value: 0 },
        { name: 'Chờ ký duyệt', value: 1 },
        { name: 'Đã ký duyệt', value: 2 },
        { name: 'Bị từ chối ký', value: 3 },
        { name: 'Đã lập bảng THTT', value: 4 },
        { name: 'Đã thanh toán', value: 5 },
        { name: 'Đã hủy', value: 6 },
    ];
    allowanceTypeOptions = [];

    constructor(private router: Router,
                public dialogService: DialogService,
                private rewardProposeSignService: RewardProposeSignService,
                private allowancePeriodService : AllowancePeriodService,
                private allowanceProposalSignService : AllowanceProposalSignService,
                private signDocumentService: SignDocumentService,
                private vfsInvoiceService: VfsInvoiceService,
                private app: AppComponent,
    ) {
        super();
        this.yearList = this.getYearList();
        this.setMainService(allowanceProposalSignService);
        this.allowancePeriodService.checkPermissionAllowance().subscribe(res => {
            if(res){
                this.allowanceTypeOptions = []
                if(res.illnessAllowance === 1){
                    this.allowanceTypeOptions.push({ name: 'Trợ cấp bệnh', value: 3 })
                }
                if(res.infertilityAllowance === 1){
                    this.allowanceTypeOptions.push({ name: 'Trợ cấp hiếm muộn', value: 4 })
                }
                if(res.supportAllowance === 1){
                    this.allowanceTypeOptions.push({ name: 'Hỗ trợ', value: 2 })
                }
            }
        })
        this.orgTypeOptions = APP_CONSTANTS.REWARD_GENERAL_TYPE_LIST;
        this.allowancePeriodService.getAllAllowancePeriodSearch().subscribe(res => {
            this.AllowancePeriodList = res
        })
    }

    ngOnInit() {
        this.formSearch = this.buildForm({}, this.formConfig);
        this.processSearch();
    }

    private getYearList() {
        const yearList = [];
        for (let i = (this.currentYear - 20); i <= (this.currentYear + 20); i++) {
            const obj = {
                year: i
            };
            yearList.push(obj);
        }
        return yearList;
    }

    get f() {
        return this.formSearch.controls;
    }

    additional(){
        this.router.navigate(['/population/allowance-proposal-sign/create'])
    }

    edit(item) {
        this.router.navigate(['/population/allowance-proposal-sign/edit', item.allowanceProposalSignId])
    }

    viewDetail(item) {
        this.router.navigate(['/population/allowance-proposal-sign/view', item.allowanceProposalSignId])
    }

    navigateToActSignPage(item?) {
        this.router.navigate([`/voffice-signing/allowance-proposal-sign/`, item.signDocumentId]);
    }

    processDelete(item){
        this.app.confirmDelete(null, () => {// on accepted
            this.allowanceProposalSignService.deleteById(item.allowanceProposalSignId).subscribe(res => {
                if (res.code == 'warning') {
                    this.app.warningMessage(res.code, res.data)
                } else {
                    this.processSearch();
                }
            })
        }, () => {

        });

    }

    public downloadDataInList(item: any) {
        if (item && item.allowanceProposalSignId) {
            this.allowanceProposalSignService.downloadDataInList(item.allowanceProposalSignId).subscribe(res => {
                saveAs(res, 'Danh sách tờ trình trợ cấp.xlsx');
            });
        }
    }
    public transferPayment(item: any) {
        this.app.confirmMessage("app.rewardBTHTT.confirmHasNotPermission", () => { // accept
          this.allowanceProposalSignService.processTransferPayment(item.allowanceProposalSignId)
              .subscribe(res => {
                if (this.rewardProposeSignService.requestIsSuccess(res)) {
                    this.app.successMessage('success');
                    this.processSearch();
                    window.location.reload()
                }
                else{

                    const ref = this.dialogService.open(AllowanceProposalErrorComponent, {
                        header: 'Thông báo lỗi',
                        width: '50%',
                        baseZIndex: 2000,
                        contentStyle: {"padding": "0"},
                        data: {
                          errorSAP: res.code
                        }
                      });
                    this.exportInvoice(item.allowanceProposalSignId)
                    
                }
              })
        }, () => {
          // rejected
        })
      }
    exportInvoice(allowanceProposalSignId){
        this.vfsInvoiceService.exportErrorInvoiceAfterPayV2(allowanceProposalSignId).subscribe(res => {
            if(res && res.size > 0)
                saveAs(res, 'Danh sách hóa đơn lỗi.xls');
        })
    }

      public transferFileAttach(item: any) {
        this.app.confirmMessage("app.rewardBTHTT.confirmHasNotPermission", () => { // accept
          this.allowanceProposalSignService.sysnFileAttach(item.allowanceProposalSignId)
              .subscribe(res => {
                if (this.rewardProposeSignService.requestIsSuccess(res)) {
                    this.app.successMessage('success');
                    this.processSearch();
                    window.location.reload()
                }
                else{

                    const ref = this.dialogService.open(AllowanceProposalErrorComponent, {
                        header: 'Thông báo lỗi',
                        width: '50%',
                        baseZIndex: 2000,
                        contentStyle: {"padding": "0"},
                        data: {
                          errorSAP: res.code
                        }
                      });
                    
                }
              })
        }, () => {
          // rejected
        })
      }

      public sysStatement(item: any) {
        this.app.confirmMessage("app.rewardPayment.confirmHasNotPermission", () => { // accept
          this.allowanceProposalSignService.processSynStatement(item.allowanceProposalSignId)
              .subscribe(res => {
                if (this.rewardProposeSignService.requestIsSuccess(res)) {
                    this.app.successMessage('success');
                    this.processSearch();
                }
                else{
                    const ref = this.dialogService.open(AllowanceProposalErrorComponent, {
                        header: 'Thông báo lỗi',
                        width: '50%',
                        baseZIndex: 2000,
                        contentStyle: {"padding": "0"},
                        data: {
                          errorSAP: res.code
                        }
                      });                  
     
                }
              })
        }, () => {
          // rejected
        })
      }


      public rejectStatement(item: any) {
        this.app.confirmMessage("app.rewardPayment.confirmHasNotPermission", () => { // accept
          this.allowanceProposalSignService.processRejectStatement(item.allowanceProposalSignId)
              .subscribe(res => {
                if (this.rewardProposeSignService.requestIsSuccess(res)) {
                    this.app.successMessage('success');
                    this.processSearch();
                    window.location.reload()
                }
                else{
                    const ref = this.dialogService.open(AllowanceProposalErrorComponent, {
                        header: 'Thông báo lỗi',
                        width: '50%',
                        baseZIndex: 2000,
                        contentStyle: {"padding": "0"},
                        data: {
                          errorSAP: res.code
                        }
                      });                  
     
                }
              })
        }, () => {
          // rejected
        })
      }


      public completeStatement(item: any) {
        this.app.confirmMessage("app.rewardPayment.confirmHasNotPermission", () => { // accept
          this.allowanceProposalSignService.processCompleteStatement(item.allowanceProposalSignId)
              .subscribe(res => {
                if (this.rewardProposeSignService.requestIsSuccess(res)) {
                    this.app.successMessage('success');
                    this.processSearch();
                    window.location.reload()
                }
                else{
                    const ref = this.dialogService.open(AllowanceProposalErrorComponent, {
                        header: 'Thông báo lỗi',
                        width: '50%',
                        baseZIndex: 2000,
                        contentStyle: {"padding": "0"},
                        data: {
                          errorSAP: res.code
                        }
                      });                  
     
                }
              })
        }, () => {
          // rejected
        })
      }

    syncSign(item: any) {
        this.signDocumentService.syncSign(item.transCode)
            .subscribe(res => {
                this.app.successMessage('voffice.success');
                this.processSearch();
            })
    }

    changeOrgType(event: any){
        if(event === 2){
            this.branch = 3
        }else if(event === 3){
            this.branch = 1
        }else if(event === 4){
            this.branch = 2
        }else{
            this.branch = 0
        }
    }
}
