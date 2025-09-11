import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BaseComponent} from "@app/shared/components/base-component/base-component.component";
import {CommonUtils} from "@app/shared/services";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {APP_CONSTANTS, DEFAULT_MODAL_OPTIONS, MODAL_XL_OPTIONS} from "@app/core";
import {ActivatedRoute, Router} from "@angular/router";
import {AppComponent} from "@app/app.component";
import {FileControl} from "@app/core/models/file.control";
import {AllowancePeriodService} from "@app/core/services/population/allowance-period.service";
import {WelfarePolicyCategoryService} from "@app/core/services/population/welfare-policy-category.service";
import {AllowanceProposalService} from "@app/core/services/population/allowance-proposal.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {HelperService} from "@app/shared/services/helper.service";
import {EmpAllowanceRequestService} from "@app/core/services/population/emp-allowance-request.service";
import {
    AllowanceProposalFormPopupComponent
} from "@app/modules/population/allowance-proposal/allowance-proposal-form/allowance-proposal-form-popup/allowance-proposal-form-popup.component";
import {WelfarePolicyProposalService} from "@app/core/services/population/welfare-policy-proposal.service";
import {
    EmpAllowanceRequestPopupComponent
} from "@app/modules/population/allowance-proposal/emp-allowance-request-popup/emp-allowance-request-popup.component";
import {MassOrganizationService} from "@app/core/services/mass-organization/mass-organization.service";
import {HrStorage} from "@app/core/services/HrStorage";
import {UrlConfig} from "@env/environment";
@Component({
    selector: 'allowance-proposal-form',
    templateUrl: './allowance-proposal-form.component.html',
    styleUrls: ['./allowance-proposal-form.component.css']
})
export class AllowanceProposalFormComponent extends BaseComponent implements OnInit {
    formSave: FormGroup;
    view: boolean;
    update: boolean;
    create: boolean;
    orgTypeOptions;
    isDisable: boolean = false;
    allowanceTypeOptions = [];
    welfarePolicyCategoryList = [];
    operationKey = 'action.view';
    adResourceKey = 'resource.allowanceProposal';
    AllowancePeriodList: any;
    orgOptions;
    formConfig = {
        allowanceProposalId: [null],
        allowancePeriodId: [null, Validators.required],
        name: ['', Validators.required],
        allowanceType: [null, Validators.required],
        orgType: [null],
        status: [null],
        receiverId: [null],
        proposeOrgId: [null, Validators.required],
        signOrgId: [null, Validators.required],
        approveOrgId: [null, Validators.required],
        isSynthetic: [0],
        allowanceProposalBOList: [null],
        empAllowanceRequestBTBOList: [null],
        empAllowanceRequestNTBOList: [null],
    }
    // DS đề xuất cần tổng hợp
    allowanceProposalBOList: FormArray;
    firstRowIndex = 0;
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
        receiverId: [null],
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
        allowancePeriod: [null],
        relationShip: [null],
        objectName: [null],
        content: [null],
        desease: [null],
        reason: [null],
        amountTotal: [null],
        receiverId: [null],
    }
    // DS đề nghị - nhân thân
    empAllowanceRequestNTBOList: FormArray;
    firstRowIndexNT = 0;
    pageSizeNT = 10;
    branch: number = 0;
    rootId: number = 0;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private welfarePolicyCategoryService: WelfarePolicyCategoryService,
        private allowancePeriodService : AllowancePeriodService,
        private allowanceProposalService : AllowanceProposalService,
        private massOrganizationService : MassOrganizationService,
        private empAllowanceRequestService : EmpAllowanceRequestService,
        private welfarePolicyProposalService: WelfarePolicyProposalService,
        private fb: FormBuilder,
        private app: AppComponent,
        private modalService: NgbModal,
        private helperService: HelperService,
    ) {
        super();
        this.setMainService(allowanceProposalService);
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
            this.allowanceProposalService.findOne(Number(this.activatedRoute.snapshot.paramMap.get('id'))).subscribe(res=> {
                if(res && res.data){
                    if(res.data.orgType === 2){
                        this.branch = 3
                    }else if(res.data.orgType === 3){
                        this.branch = 1
                    }else if(res.data.orgType === 4){
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
                    this.welfarePolicyProposalService.getOrganizationByMassOrganization({proposalOrgId: res.data.proposeOrgId}).subscribe(res => {
                        this.orgOptions = res
                    })
                    this.buildForms(res.data);
                    this.buildFormAllowanceProposal(1,res.data.allowanceProposalBOList);
                    this.buildFormEmpAllowanceRequestNT(res.data.empAllowanceRequestNTBOList);
                    this.buildFormEmpAllowanceRequestBT(res.data.empAllowanceRequestBTBOList);
                }
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
            this.buildFormAllowanceProposal(0);
            const group = this.makeDefaultFormAllowanceProposal();
            controls.push(group);
            this.allowanceProposalBOList = controls;
        }
        controls.removeAt(index)
        this.buildFormAllowanceProposal(0,this.allowanceProposalBOList.value)
        this.getAllEmpAllowanceRequestTableBean()
    }

    private buildFormAllowanceProposal(check:number,list?: any) {
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
        if(check===0 && !this.create){
            this.getAllEmpAllowanceRequestTableBean();
        }
    }

    getAllowanceProposalTableBean(){
        if(this.f['isSynthetic'].value && this.f['allowancePeriodId'].value && this.f['proposeOrgId'].value){
            const form = {
                allowancePeriodId: this.f['allowancePeriodId'].value,
                proposeOrgId: this.f['proposeOrgId'].value,
                isSign: 0,
                allowanceProposalId: this.f['allowanceProposalId'].value? this.f['allowanceProposalId'].value: 0
            }
            this.allowanceProposalService.getAllowanceProposalTableBean(form).subscribe(res => {
                this.buildFormAllowanceProposal(0,res)
                this.getAllEmpAllowanceRequestTableBean()
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
        if(this.f['allowancePeriodId'].value && this.f['proposeOrgId'].value && this.f['signOrgId'].value &&
            this.f['allowancePeriodId'].value != "" && this.f['proposeOrgId'].value != "" && this.f['signOrgId'].value != "" ){
            let list = []
            if(this.f['isSynthetic'].value != null && this.f['isSynthetic'].value && this.allowanceProposalBOList.value.length > 0
                && this.allowanceProposalBOList.value[0].allowanceProposalId != null){
                for(let item in this.allowanceProposalBOList.value){
                    list.push(this.allowanceProposalBOList.value[item].allowanceProposalId);
                }
                const form = {
                    isSynthetic: 1,
                    allowancePeriodId: this.f['allowancePeriodId'].value,
                    approveOrgId: this.f['proposeOrgId'].value,
                    path: this.f['signOrgId'].value,
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
            }else{
                const form = {
                    isSynthetic: 0,
                    allowancePeriodId: this.f['allowancePeriodId'].value,
                    approveOrgId: this.f['proposeOrgId'].value,
                    path: this.f['signOrgId'].value,
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
    }

    public goBack() {
        this.router.navigate(['/population/allowance-proposal']);
    }

    public goView(id: any) {
        this.router.navigate([`/population/allowance-proposal/view/${id}`]);
    }


    public processSaveOrUpdate() {
        
        // if(!this.f['isSynthetic'].value ){
        //     if(!this.f['receiverId'].value){
        //         this.app.warningMessage("","Người nhận tiền không được để trống!");
        //         return;
        //     }
        //     for(const i in this.empAllowanceRequestNTBOList.value){
        //         if(!this.empAllowanceRequestNTBOList.value[i].receiverId){
        //             this.app.warningMessage("","Người nhận tiền thân nhân không được để trống!");
        //             return;
        //         }
        //
        //     }
        //     for(const i in this.empAllowanceRequestBTBOList.value){
        //         if(!this.empAllowanceRequestBTBOList.value[i].receiverId){
        //             this.app.warningMessage("","Người nhận tiền bản thân không được để trống!");
        //             return;
        //         }
        //
        //     }
        //
        //
        // }
        if (!CommonUtils.isValidForm(this.formSave)) {
            return;
        }
        if(this.f['isSynthetic'].value && (this.f['isSynthetic'].value === true || this.f['isSynthetic'].value === 1)){
            if(this.allowanceProposalBOList.value && this.allowanceProposalBOList.value[0].allowanceProposalId){
                this.formSave.controls['allowanceProposalBOList'].setValue(this.allowanceProposalBOList.value);
            }else{
                this.app.warningMessage("","Danh sách các đề xuất tổng hợp không được để trống!");
                return;
            }
        }
       
        let checkBTListRequest : boolean = false;
        let checkNTListRequest : boolean = false;
        if(this.empAllowanceRequestBTBOList.value && this.empAllowanceRequestBTBOList.value[0].empAllowanceRequestId){
            this.formSave.controls['empAllowanceRequestBTBOList'].setValue(this.empAllowanceRequestBTBOList.value);
        }else{
            checkBTListRequest = true;
        }
        if(this.empAllowanceRequestNTBOList.value && this.empAllowanceRequestNTBOList.value[0].empAllowanceRequestId){
            this.formSave.controls['empAllowanceRequestNTBOList'].setValue(this.empAllowanceRequestNTBOList.value);
        }else{
            checkNTListRequest = true
        }
        if(checkBTListRequest && checkNTListRequest){
            this.app.warningMessage("","Không có đề nghị nào trong danh sách chi tiết bản thân hoặc thân nhân!");
            return;
        }
        this.app.confirmMessage(null, () => {
            this.allowanceProposalService.saveOrUpdateFormFile(this.formSave.value)
                .subscribe(res => {
                    this.goView(res.data.allowanceProposalId);
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
                this.massOrganizationService.getListMassOrgByEmployeeId(HrStorage.getUserToken().userInfo.employeeId, this.branch).subscribe(res =>{
                    if(res && res.length > 0){
                        const arr = res[0].orgPath.split('/');
                        this.rootId =  arr[0] != ""? arr[0]: arr[1];
                    }
                });
            }
        })
        this.getAllowanceProposalTableBean()
        this.getAllEmpAllowanceRequestTableBean()
    }

    public onChangeSynthetic(event) {
        this.formSave.value.isSynthetic = event.target['checked'];
        this.getAllowanceProposalTableBean()
        // this.getAllEmpAllowanceRequestTableBean()
    }

    changeProposeOrgId(){
        if(this.f['proposeOrgId'].value && this.f['proposeOrgId'].value != ""){
            this.welfarePolicyProposalService.getOrganizationByMassOrganization({proposalOrgId: this.f['proposeOrgId'].value}).subscribe(res => {
                this.orgOptions = res
            })
            this.getAllowanceProposalTableBean()
            this.getAllEmpAllowanceRequestTableBean()
        }
    }

    showPopupAdd(){
        let list = []
        if(this.allowanceProposalBOList.controls.length > 0 && this.allowanceProposalBOList.controls[0].value.allowanceProposalId != null){
            for(let item in this.allowanceProposalBOList.controls){
                list.push(this.allowanceProposalBOList.controls[item].value)
            }
        }
        const modalRef = this.modalService.open(AllowanceProposalFormPopupComponent, MODAL_XL_OPTIONS);
        const data = {
            allowanceProposalId: this.f['allowanceProposalId'].value,
            allowancePeriodId: this.f['allowancePeriodId'].value,
            proposeOrgId: this.f['proposeOrgId'].value,
            allowanceProposalBOList: list,
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
                    this.buildFormAllowanceProposal(0,this.allowanceProposalBOList.value)
                    this.getAllEmpAllowanceRequestTableBean();
                }
            }
        });
    }

    viewDetailEmpAllowanceRequest(item:any){
        let url = UrlConfig.clientAddress+'/population/emp-allowance-request/view-by-proposal/'+this.f['allowanceProposalId'].value+'/'+item.value.empAllowanceRequestId
        window.open(url,'_blank')
    }

    processUpdate(item, type: any){
        const modalRef = this.modalService.open(EmpAllowanceRequestPopupComponent, DEFAULT_MODAL_OPTIONS);
        const data = {
            empAllowanceRequestId: item.value.empAllowanceRequestId,
            type: type
        }
        modalRef.componentInstance.setFormValue(data);
        modalRef.result.then((result) => {
            this.router.navigate(['/population/allowance-proposal/view', this.f['allowanceProposalId'].value])
        });
    }

    navigate() {
        this.router.navigate(['/population/allowance-proposal/edit', this.f['allowanceProposalId'].value])
    }

    fillEmployeeToList(){
        if(CommonUtils.isNullOrEmpty(this.formSave.get('receiverId').value)){
            return;
        }else{
            if(this.empAllowanceRequestBTBOList.value.length > 0){
                for(const i in this.empAllowanceRequestBTBOList.value){
                    this.empAllowanceRequestBTBOList.value[i].receiverId = this.formSave.get('receiverId').value
                }
            }
            if(this.empAllowanceRequestNTBOList.value.length > 0){
                for(const i in this.empAllowanceRequestNTBOList.value){
                    this.empAllowanceRequestNTBOList.value[i].receiverId = this.formSave.get('receiverId').value
                }
            }
            this.buildFormEmpAllowanceRequestBT(this.empAllowanceRequestBTBOList.value);
        
            this.buildFormEmpAllowanceRequestNT(this.empAllowanceRequestNTBOList.value);
        }
    }
}
