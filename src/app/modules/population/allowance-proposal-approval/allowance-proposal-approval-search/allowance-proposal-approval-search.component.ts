import {Component, OnInit} from '@angular/core';
import {BaseComponent} from "@app/shared/components/base-component/base-component.component";
import {Router} from "@angular/router";
import {AppComponent} from "@app/app.component";
import {APP_CONSTANTS} from "@app/core";
import {AllowancePeriodService} from "@app/core/services/population/allowance-period.service";
import {AllowanceProposalService} from "@app/core/services/population/allowance-proposal.service";
import {AllowanceProposalApprovalService} from "@app/core/services/population/allowance-proposal-approval.service";
import {DialogService} from "primeng/api";
import {
    AllowanceProposalReasonCancel
} from "@app/modules/population/allowance-proposal-approval/allowance-proposal-approval-search/allowance-proposal-approval-cancel/allowance-proposal-reason-cancel";
import {saveAs} from "file-saver";
import {MassOrganizationService} from "@app/core/services/mass-organization/mass-organization.service";
import {HrStorage} from "@app/core/services/HrStorage";

@Component({
    selector: 'allowance-proposal-approval-search',
    templateUrl: './allowance-proposal-approval-search.component.html',
    styleUrls: ['./allowance-proposal-approval-search.component.css']
})
export class AllowanceProposalApprovalSearchComponent extends BaseComponent implements OnInit {
    formConfig = {
        allowancePeriodId: [null],
        orgType: [null],
        name: [null],
        proposeOrgId: [null],
        signOrgId: [null],
        approveOrgId: [null],
        allowanceType: [null],
        status: [null],
        isAllowancePeriodId: [false],
        isOrgType: [false],
        isName: [false],
        isProposeOrgId: [false],
        isSignOrgId: [false],
        isApproveOrgId: [false],
        isAllowanceType: [false],
        isStatus: [false],
    };
    branch: number = 0;
    rootId: number = 0;
    orgTypeOptions;
    AllowancePeriodList: any;
    statusList = [
        { name: 'Dự thảo', value: 0 },
        { name: 'Chờ xét chọn', value: 1 },
        { name: 'Đang xét chọn', value: 2 },
        { name: 'Bị từ chối', value: 3 },
        { name: 'Đang trình ký', value: 4 },
        { name: 'Đã xét chọn', value: 5 },
    ];
    allowanceTypeOptions = [];

    constructor(private router: Router,
                private allowancePeriodService : AllowancePeriodService,
                private allowanceProposalService : AllowanceProposalService,
                private massOrganizationService : MassOrganizationService,
                private allowanceProposalApprovalService : AllowanceProposalApprovalService,
                public dialogService: DialogService,
                private app: AppComponent,
    ) {
        super();
        this.setMainService(allowanceProposalApprovalService);
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

    get f() {
        return this.formSearch.controls;
    }

    processApprove(item) {
        this.router.navigate(['/population/allowance-proposal-approval/edit', item.allowanceProposalId])
    }

    viewDetail(item) {
        this.router.navigate(['/population/allowance-proposal-approval/view', item.allowanceProposalId])
    }

    processReject(item){
        const ref = this.dialogService.open(AllowanceProposalReasonCancel, {
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

    processCancel(item){
        if(item && item.allowanceProposalId){
            this.app.confirm('label.allowance.proposal.approval.confirmStatus.message','label.allowance.proposal.approval.confirmStatus.title', () => { // accept
                this.allowanceProposalApprovalService.updateStatus(item.allowanceProposalId).subscribe(res => {
                    this.processSearch();
                })
            }, () => {
                // rejected
            })
        }
    }

    public downloadDataInList(item: any) {
        if (item && item.allowanceProposalId) {
            this.allowanceProposalApprovalService.export(item.allowanceProposalId).subscribe(res => {
                saveAs(res, 'Danh sách quản lý xét chọn đề xuất.xlsx');
            });
        }
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
                this.rootId =  arr[0] != ""? arr[0]: arr[1];
            }
        });
    }
}
