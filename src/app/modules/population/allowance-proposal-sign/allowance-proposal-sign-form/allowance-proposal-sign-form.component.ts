import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BaseComponent} from "@app/shared/components/base-component/base-component.component";
import {CommonUtils} from "@app/shared/services";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {APP_CONSTANTS, MODAL_XL_OPTIONS} from "@app/core";
import {ActivatedRoute, Router} from "@angular/router";
import {AppComponent} from "@app/app.component";
import {FileControl} from "@app/core/models/file.control";
import {AllowancePeriodService} from "@app/core/services/population/allowance-period.service";
import {WelfarePolicyCategoryService} from "@app/core/services/population/welfare-policy-category.service";
import {AllowanceProposalService} from "@app/core/services/population/allowance-proposal.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {HelperService} from "@app/shared/services/helper.service";
import {EmpAllowanceRequestService} from "@app/core/services/population/emp-allowance-request.service";
import {WelfarePolicyProposalService} from "@app/core/services/population/welfare-policy-proposal.service";
import {AllowanceProposalSignService} from "@app/core/services/population/allowance-proposal-sign.service";
import {
    AllowanceProposalSignFormPopupComponent
} from "@app/modules/population/allowance-proposal-sign/allowance-proposal-sign-form/allowance-proposal-sign-form-popup/allowance-proposal-sign-form-popup.component";
import { RewardProposeSignService } from '@app/core/services/reward-propose-sign/reward-propose-sign.service';
import { DialogService } from 'primeng/api';

import { AllowanceProposalErrorComponent } from '../allowance-proposal-error/allowance-proposal-error';
import {UrlConfig} from "@env/environment";
import {
    RewardProposeSignErrorComponent
} from "@app/modules/reward/reward-propose-sign/reward-propose-sign-error/reward-propose-sign-error";
@Component({
    selector: 'allowance-proposal-sign-form',
    templateUrl: './allowance-proposal-sign-form.component.html',
    styleUrls: ['./allowance-proposal-sign-form.component.css']
})
export class AllowanceProposalSignFormComponent extends BaseComponent implements OnInit {
    formSave: FormGroup;
    view: boolean;
    update: boolean;
    create: boolean;
    orgTypeOptions;
    rootId: any;
    listReimbursement: any;
    URL: any;
    listReimbursementInvoice: any;
    orgOptions;
    allowanceTypeOptions = [];
    welfarePolicyCategoryList = [];
    AllowancePeriodList: any;
    formConfig = {
        allowanceProposalSignId: [null],
        allowancePeriodId: [null, Validators.required],
        orgType: [null],
        status: [null],
        note: [null],
        name: ['', Validators.required],
        allowanceType: [null, Validators.required],
        proposalOrgId: [null, Validators.required],
        approveOrgId: [null, Validators.required],
        signOrgId: [null, Validators.required],
        allowanceProposalBOList: [null],
        empAllowanceRequestBTBOList: [null],
        empAllowanceRequestNTBOList: [null],
        sapstatmentNo: [null],
        sapStatementStatus: [null],
        paymentStatus: [null]
    }
    // DS đề xuất cần tổng hợp
    allowanceProposalBOList: FormArray;
    firstRowIndex = 0;
    branch: number = 0;
    pageSize = 10;
    formAllowanceProposal = {
        allowanceProposalId: [null],
        name: [null],
        allowancePeriod: [null],
        proposeOrg: [null],
        approveOrg: [null],
        signOrg: [null],
        orgType: [null],
        year: [null],
        employeeProposal: [null],
        amountTotal: [null],
        status: [null],
    };
    // DS đề nghị - bản thân
    empAllowanceRequestBTBOList: FormArray;
    firstRowIndexBT = 0;
    pageSizeBT = 10;
    formEmpAllowanceRequest = {
        empAllowanceRequestId: [null],
        employeeCode: [null],
        employeeName: [null],
        orgName: [null],
        relationShip: [null],
        objectName: [null],
        allowancePeriod: [null],
        content: [null],
        desease: [null],
        reason: [null],
        amountTotal: [null],
        amountPerBill: [null],
    }
    // DS đề nghị - nhân thân
    empAllowanceRequestNTBOList: FormArray;
    firstRowIndexNT = 0;
    pageSizeNT = 10;

    constructor(
        public dialogService: DialogService,
        private rewardProposeSignService: RewardProposeSignService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private welfarePolicyCategoryService: WelfarePolicyCategoryService,
        private allowancePeriodService : AllowancePeriodService,
        private allowanceProposalService : AllowanceProposalService,
        private empAllowanceRequestService : EmpAllowanceRequestService,
        private welfarePolicyProposalService : WelfarePolicyProposalService,
        private allowanceProposalSignService : AllowanceProposalSignService,
        private fb: FormBuilder,
        private app: AppComponent,
        private modalService: NgbModal,
        private helperService: HelperService,
    ) {
        super();
        this.setMainService(allowanceProposalSignService);
        this.URL = UrlConfig.clientAddress
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
        const function1 = this.activatedRoute.snapshot.routeConfig.path.split('/')[0];
        if (function1 == 'edit') {
            this.update = true;
            this.view = false;
            this.create = false;
        } else if (function1 == 'view') {
            this.view = true;
            this.update = false;
            this.create = false;
        } else if (function1 == 'create') {
            this.view = false;
            this.update = false;
            this.create = true;
        }
        this.orgTypeOptions = APP_CONSTANTS.REWARD_GENERAL_TYPE_LIST;
        this.rootId = APP_CONSTANTS.ORG_ROOT_ID
        if(this.view){
            this.allowancePeriodService.getAll().subscribe(res => {
                this.AllowancePeriodList = res
            })
        }else{
            this.allowancePeriodService.getAllowancePeriod().subscribe(res => {
                this.AllowancePeriodList = res
            })
        }
        this.allowanceProposalBOList = new FormArray([this.makeDefaultFormAllowanceProposal()])
        this.empAllowanceRequestBTBOList = new FormArray([this.makeDefaultFormEmpAllowanceRequest()])
        this.empAllowanceRequestNTBOList = new FormArray([this.makeDefaultFormEmpAllowanceRequest()])
        if (this.view || this.update) {
            this.allowanceProposalSignService.findOne(Number(this.activatedRoute.snapshot.paramMap.get('id'))).subscribe(res=> {
                this.welfarePolicyProposalService.getOrganizationByMassOrganization({proposalOrgId: res.data.proposalOrgId}).subscribe(res => {
                    this.orgOptions = res
                })
                this.buildForms(res.data);
                this.buildFormAllowanceProposal(1,res.data.allowanceProposalBOList);
                this.listReimbursement = res.data.reimbursementList || [];
            })
        } else {
            this.buildFormAllowanceProposal(0);
            this.buildFormEmpAllowanceRequestNT();
            this.buildFormEmpAllowanceRequestBT();
            this.buildForms({});
        }
    }

    ngOnInit() {
    }

    get f() {
        return this.formSave.controls;
    }

    public buildForms(data?: any) {
        this.formSave = this.buildForm(data, this.formConfig);
        const fileAttachment = new FileControl(null);
        if (data && data.fileAttachment) {
            if (data.fileAttachment.attachedFiles) {
                fileAttachment.setFileAttachment(data.fileAttachment.attachedFiles);
            }
        }
        this.formSave.addControl('attachedFiles', fileAttachment);
    }

    // đề xuất con
    private makeDefaultFormAllowanceProposal(): FormGroup {
        const formSaveRequest = this.buildForm({}, this.formAllowanceProposal);
        return formSaveRequest;
    }

    public removeRow(index: number, item: FormGroup) {
        const controls = this.allowanceProposalBOList as FormArray;
        if (controls.length === 1) {
            this.buildFormAllowanceProposal(1);
            const group = this.makeDefaultFormAllowanceProposal();
            controls.push(group);
            this.allowanceProposalBOList = controls;
        }
        controls.removeAt(index)
        this.getAllEmpAllowanceRequestTableBean();
    }

    private buildFormAllowanceProposal(check: number,list?: any) {
        if (!list || list.length == 0) {
            this.allowanceProposalBOList = new FormArray([this.makeDefaultFormAllowanceProposal()]);
        } else {
            this.helperService.isProcessing(true);
            const controls = new FormArray([]);
            for (const i in list) {
                const formTableConfig = list[i];
                const group = this.makeDefaultFormAllowanceProposal();
                group.patchValue(formTableConfig);
                controls.push(group);
            }
            this.allowanceProposalBOList = controls;
            this.helperService.isProcessing(false);
        }
        if(check){
            this.getAllEmpAllowanceRequestTableBean();
        }
    }

    getAllowanceProposalTableBean(){
        if(this.formSave.controls['allowancePeriodId'].value && this.formSave.controls['proposalOrgId'].value){
            const form = {
                allowancePeriodId: this.formSave.controls['allowancePeriodId'].value,
                proposeOrgId: this.formSave.controls['proposalOrgId'].value,
                isSign: 1,
                allowanceProposalId: this.formSave.controls['allowanceProposalId'] ? this.formSave.controls['allowanceProposalId'].value: 0,
            }

            this.allowanceProposalService.getAllowanceProposalTableBean(form).subscribe(res => {
                this.buildFormAllowanceProposal(1,res)
            })
        }
    }

    // đề nghị
    private makeDefaultFormEmpAllowanceRequest(): FormGroup {
        const formSaveRequest = this.buildForm({}, this.formEmpAllowanceRequest);
        return formSaveRequest;
    }

    private buildFormEmpAllowanceRequestNT(list?: any) {
        if (!list || list.length == 0) {
            this.empAllowanceRequestNTBOList = new FormArray([this.makeDefaultFormEmpAllowanceRequest()]);
        } else {
            this.helperService.isProcessing(true);
            const controls = new FormArray([]);
            for (const i in list) {
                const formTableConfig = list[i];
                const group = this.makeDefaultFormEmpAllowanceRequest();
                group.patchValue(formTableConfig);
                controls.push(group);
            }
            this.empAllowanceRequestNTBOList = controls;
            this.helperService.isProcessing(false);
        }
    }

    private buildFormEmpAllowanceRequestBT(list?: any) {
        if (!list || list.length == 0) {
            this.empAllowanceRequestBTBOList = new FormArray([this.makeDefaultFormEmpAllowanceRequest()]);
        } else {
            this.helperService.isProcessing(true);
            const controls = new FormArray([]);
            for (const i in list) {
                const formTableConfig = list[i];
                const group = this.makeDefaultFormEmpAllowanceRequest();
                group.patchValue(formTableConfig);
                controls.push(group);
            }
            this.empAllowanceRequestBTBOList = controls;
            this.helperService.isProcessing(false);
        }
    }

    getAllEmpAllowanceRequestTableBean(){
        this.getEmpAllowanceRequestTableBean(1);
        this.getEmpAllowanceRequestTableBean(2);

    }

    getEmpAllowanceRequestTableBean(objectType: number){
        if(this.formSave.controls['allowancePeriodId'].value && this.formSave.controls['proposalOrgId'].value){
            let list = []
            if(this.allowanceProposalBOList.value.length > 0
                && this.allowanceProposalBOList.value[0].allowanceProposalId != null){
                for(let item in this.allowanceProposalBOList.value){
                    list.push(this.allowanceProposalBOList.value[item].allowanceProposalId);
                }
            }
            const form = {
                isSynthetic: 1,
                allowancePeriodId: this.formSave.controls['allowancePeriodId'].value,
                approveOrgId: this.formSave.controls['proposalOrgId'].value,
                objectType: objectType,
                list: list,
            }
            this.empAllowanceRequestService.getEmpAllowanceRequestTableBean(form).subscribe(res => {
                if(objectType === 1){
                    this.buildFormEmpAllowanceRequestBT(res)
                }else{
                    this.buildFormEmpAllowanceRequestNT(res)
                }
            })
        }
    }

    public goBack() {
        this.router.navigate(['/population/allowance-proposal-sign']);
    }

    public goView(id: any) {
        this.router.navigate([`/population/allowance-proposal-sign/view/${id}`]);
    }


    public processSaveOrUpdate() {
        if (!CommonUtils.isValidForm(this.formSave)) {
            return;
        }
        if(this.allowanceProposalBOList.value && this.allowanceProposalBOList.value[0].allowanceProposalId){
            this.formSave.controls['allowanceProposalBOList'].setValue(this.allowanceProposalBOList.value);
        }else{
            this.app.warningMessage("","Danh sách các đề xuất tổng hợp không được để trống!");
            return;
        }
        this.app.confirmMessage(null, () => {
            this.allowanceProposalSignService.saveOrUpdateFormFile(this.formSave.value)
                .subscribe(res => {
                    this.goView(res.data.allowanceProposalSignId);
                });
        }, () => {

        });

    }


    changeAllowancePeriod(){
        this.formSave.get('allowanceType').setValue(null)
        this.formSave.get('orgType').setValue(null)
        this.AllowancePeriodList.forEach((item: any)=>{
            if(item.allowancePeriodId == this.formSave.controls['allowancePeriodId'].value){
                this.formSave.get('allowanceType').setValue(item.allowanceType)
                this.formSave.get('orgType').setValue(item.orgType)
                if(item.orgType === 2){
                    this.branch = 3
                }else if(item.orgType === 3){
                    this.branch = 1
                }else if(item.orgType === 4){
                    this.branch = 2
                }else{
                    this.branch = 0
                }
            }
        })
        this.getAllowanceProposalTableBean()
        // this.getAllEmpAllowanceRequestTableBean()
    }

    changeProposeOrgId(){
        if(this.f['proposalOrgId'].value){
            this.welfarePolicyProposalService.getOrganizationByMassOrganization({proposalOrgId: this.f['proposalOrgId'].value}).subscribe(res => {
                this.orgOptions = res
            });
        }
        this.getAllowanceProposalTableBean()
        // this.getAllEmpAllowanceRequestTableBean()
    }

    showPopupAdd(){
        let list = []
        if(this.allowanceProposalBOList.controls.length > 0 && this.allowanceProposalBOList.controls[0].value.allowanceProposalId != null){
            for(let item in this.allowanceProposalBOList.controls){
                list.push(this.allowanceProposalBOList.controls[item].value)
            }
        }
        const modalRef = this.modalService.open(AllowanceProposalSignFormPopupComponent, MODAL_XL_OPTIONS);
        const data = {
            allowanceProposalSignId: this.f['allowanceProposalSignId'] ? this.f['allowanceProposalSignId'].value: null,
            allowanceProposalId: this.f['allowanceProposalId'] ? this.f['allowanceProposalId'].value: 0,
            allowancePeriodId: this.f['allowancePeriodId'] ? this.f['allowancePeriodId'].value: null,
            proposeOrgId: this.f['proposalOrgId'] ? this.f['proposalOrgId'].value: null,
            allowanceProposalBOList: list
        }
        modalRef.componentInstance.setFormValue(this.propertyConfigs, data);
        modalRef.result.then((result) => {
            if (!result) {
                return;
            } else {
                if(result.length > 0){
                    for(const item in result){
                        if(result[item].isCheck){

                            if(this.allowanceProposalBOList.value[0].allowanceProposalId === "" || this.allowanceProposalBOList.value[0].allowanceProposalId === null){
                                this.allowanceProposalBOList.value.splice(0,1)
                            }
                            this.allowanceProposalBOList.value.push(result[item])
                        }
                    }
                    this.buildFormAllowanceProposal(1,this.allowanceProposalBOList.value)
                }
            }
        });
    }

    viewDetailEmpAllowanceRequest(item:any){
        this.router.navigate(['/population/emp-allowance-request/view-by-proposal-sign', this.f['allowanceProposalSignId'].value, item.value.empAllowanceRequestId])
    }

    navigate() {
        this.router.navigate(['/population/allowance-proposal-sign/edit', this.f['allowanceProposalSignId'].value])
    }

    public transferPayment() {
        this.app.confirmMessage("app.rewardBTHTT.confirmHasNotPermission", () => { // accept
          this.allowanceProposalSignService.processTransferPayment(this.formSave.value.allowanceProposalSignId)
              .subscribe(res => {
                if (this.rewardProposeSignService.requestIsSuccess(res)) {
                  this.app.successMessage('success');
                  this.router.navigate(['/population/allowance-proposal-sign']);
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

      public sysStatement() {
        this.app.confirmMessage("app.rewardPayment.confirmHasNotPermission", () => { // accept
          this.allowanceProposalSignService.processSynStatement(this.formSave.value.allowanceProposalSignId)
              .subscribe(res => {
                if (this.rewardProposeSignService.requestIsSuccess(res)) {
                  this.app.successMessage('success');
                  this.router.navigate(['/population/allowance-proposal-sign']);
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
    openModal(errorMsg: any) {
        const ref = this.dialogService.open(RewardProposeSignErrorComponent, {
            header: 'Mô tả lỗi',
            width: '50%',
            baseZIndex: 2000,
            contentStyle: {"padding": "0"},
            data: {
                errorSAP: errorMsg
            }
        });
    }
      
}
