import {Component, OnInit} from '@angular/core';
import {BaseComponent} from "@app/shared/components/base-component/base-component.component";
import {Router} from "@angular/router";
import {AppComponent} from "@app/app.component";
import {APP_CONSTANTS, LARGE_MODAL_OPTIONS} from "@app/core";
import {AllowancePeriodService} from "@app/core/services/population/allowance-period.service";
import {AllowanceProposalService} from "@app/core/services/population/allowance-proposal.service";
import {SignDocumentService} from "../../../../core/services/sign-document/sign-document.service";
import {
    VofficeSigningPreviewModalComponent
} from "../../../voffice-signing/preview-modal/voffice-signing-preview-modal.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {saveAs} from "file-saver";
import {HrStorage} from "@app/core/services/HrStorage";
import {MassOrganizationService} from "@app/core/services/mass-organization/mass-organization.service";

@Component({
    selector: 'allowance-proposal-search',
    templateUrl: './allowance-proposal-search.component.html',
    styleUrls: ['./allowance-proposal-search.component.css']
})
export class AllowanceProposalSearchComponent extends BaseComponent implements OnInit {
    formConfig = {
        allowancePeriodId: [null],
        orgType: [null],
        name: [null],
        proposeOrgId: [null],
        signOrgId: [null],
        approveOrgId: [null],
        decisionStartDate: [null],
        decisionEndDate: [null],
        status: [null],
        signDocumentNumber: [null],
        isAllowancePeriodId: [false],
        isOrgType: [false],
        isName: [false],
        isProposeOrgId: [false],
        isSignOrgId: [false],
        isApproveOrgId: [false],
        isDecisionStartDate: [false],
        isDecisionEndDate: [false],
        isStatus: [false],
        isSignDocumentNumber: [false],
    };
    orgTypeOptions;
    AllowancePeriodList: any;
    branch: number = 0;
    rootId: number = 0;
    statusList = [
        { name: 'Dự thảo', value: 0 },
        { name: 'Chờ xét chọn', value: 1 },
        { name: 'Đang xét chọn', value: 2 },
        { name: 'Bị từ chối', value: 3 },
        { name: 'Đang trình ký', value: 4 },
        { name: 'Đã xét chọn', value: 5 },
    ];

    constructor(private router: Router,
                private allowancePeriodService : AllowancePeriodService,
                private allowanceProposalService : AllowanceProposalService,
                private signDocumentService: SignDocumentService,
                private app: AppComponent,
                private massOrganizationService : MassOrganizationService,
                public modalService: NgbModal
    ) {
        super();
        this.setMainService(allowanceProposalService);
        this.orgTypeOptions = APP_CONSTANTS.REWARD_GENERAL_TYPE_LIST;
        this.allowancePeriodService.getAllAllowancePeriodSearch().subscribe(res => {
            this.AllowancePeriodList = res
        })
    }

    ngOnInit() {
        this.formSearch = this.buildForm({}, this.formConfig);
        this.processSearch();
    }

    get f() {
        return this.formSearch.controls;
    }

    additional(){
        this.router.navigate(['/population/allowance-proposal/create'])
    }

    edit(item) {
        this.router.navigate(['/population/allowance-proposal/edit', item.allowanceProposalId])
    }

    viewDetail(item) {
        this.router.navigate(['/population/allowance-proposal/view', item.allowanceProposalId])
    }

    prepareApprove(item){
        this.allowanceProposalService.sendApproveAllowanceProposal(item.allowanceProposalId).subscribe(res=>{
            this.processSearch();
        })
    }

    navigateToActSignPage(item?) {
        this.router.navigate([`/voffice-signing/allowance-proposal/`, item.signDocumentId]);
    }

    processDelete(item){
        this.app.confirmDelete(null, () => {// on accepted
            this.allowanceProposalService.deleteById(item.allowanceProposalId).subscribe(res => {
                if (res.code == 'warning') {

                } else {
                    this.processSearch();
                }
            })
        }, () => {

        });

    }

    cancelSign(item) {
        if (item && item.signDocumentId > 0) {
            this.app.confirmMessage('resolutionsMonth.cancelStream', () => { // on accepted
                this.signDocumentService.cancelStream('allowance-proposal', item.signDocumentId)
                    .subscribe(res => {
                        if (this.signDocumentService.requestIsSuccess(res)) {
                            this.processSearch();
                        }
                    });
            }, () => {
                // on rejected
            });
        }
    }

    previewFileSigning(signDocumentId) {
        const modalRef = this.modalService.open(VofficeSigningPreviewModalComponent, LARGE_MODAL_OPTIONS);
        modalRef.componentInstance.id = signDocumentId;
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
        this.massOrganizationService.getListMassOrgByEmployeeId(HrStorage.getUserToken().userInfo.employeeId, this.branch).subscribe(res =>{
            if(res && res.length > 0){
                const arr = res[0].orgPath.split('/');
                this.rootId = arr[0] != ""? arr[0]: arr[1];
            }
        });
    }

    public downloadDataInList(item: any) {
        if (item && item.allowanceProposalId) {
            this.allowanceProposalService.export(item.allowanceProposalId).subscribe(res => {
                saveAs(res, 'Danh sách quản lý đề xuất.xlsx');
            });
        }
    }
}
