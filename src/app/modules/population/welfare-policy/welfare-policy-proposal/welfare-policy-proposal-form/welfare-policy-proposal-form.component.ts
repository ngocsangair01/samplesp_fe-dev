import {Component, OnInit} from '@angular/core';
import {BaseComponent} from "@app/shared/components/base-component/base-component.component";
import {ActivatedRoute, Router} from "@angular/router";
import {AppParamService} from "@app/core/services/app-param/app-param.service";
import {
    APP_CONSTANTS,
    DEFAULT_MODAL_OPTIONS,
    LARGE_MODAL_OPTIONS,
    MEDIUM_MODAL_OPTIONS,
    MODAL_XL_OPTIONS,
    RequestReportService
} from "@app/core";
import {AppComponent} from "@app/app.component";
import {DialogService} from "primeng/api";
import {WelfarePolicyCategoryService} from "@app/core/services/population/welfare-policy-category.service";
import {WelfarePolicyProposalService} from "@app/core/services/population/welfare-policy-proposal.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {FormArray, FormGroup, Validators} from "@angular/forms";
import {CommonUtils} from "@app/shared/services";
import {
    WelfarePolicyProposalPopupAddComponent
} from "@app/modules/population/welfare-policy/welfare-policy-proposal/welfare-policy-proposal-form/welfare-policy-proposal-popup-add/welfare-policy-proposal-popup-add.component";
import {HelperService} from "@app/shared/services/helper.service";
import {
    WelfarePolicyProposalPopupImportComponent
} from "@app/modules/population/welfare-policy/welfare-policy-proposal/welfare-policy-proposal-form/welfare-policy-proposal-popup-import/welfare-policy-proposal-popup-import.component";
import {formatDate} from "@angular/common";

@Component({
    selector: 'welfare-policy-proposal-form',
    templateUrl: './welfare-policy-proposal-form.component.html',
    styleUrls: ['./welfare-policy-proposal-form.component.css']
})
export class WelfarePolicyProposalFormComponent extends BaseComponent implements OnInit{
    formSave: FormGroup;
    list: FormArray;
    firstRowIndex = 0;
    pageSize = 10;
    receiverTypeOptions;
    orgOptions;
    employeeFilterCondition: any;
    view: boolean = false;
    update: boolean = false;
    create: boolean = false;
    status: number = 0;
    showBtn: boolean = false;
    checkReceiverType: boolean = false;
    formConfig = {
        welfarePolicyProposalId: [''],
        proposalOrgId: ['', Validators.required],
        title: ['', Validators.required],
        periodName: [new Date()],
        spendingOrgId: ['', Validators.required],
        receiverEmployeeId: [''],
        receiverType: ['', Validators.required],
        list: [],
        sumInvNo:[''],
        sapVOSStatusDes:[''],
        sapSumInvNo:[''],
        sapStatementNo:[''],
        sapStatementStatus:[''],
        documentCode:[''],
        sapErrorMessage:[''],
        messageLog:[''],
    }
    formRequest = {
        welfarePolicyRequestId: [''],
        employeeName: [''],
        employeeId: [''],
        welfarePolicyCategoryName: [''],
        objectType: [''],
        relationshipName: [''],
        objectName: [''],
        requestDate: [''],
        status: [''],
        reason: [''],
        chairmanTypeName: [''],
        amountTotal: [''],
        receiverId: [''],
        invNo:[''],
        paymentMethod:[''],
        sapInvNoMsg:[''],
        sapInvNoStatus:[''],
        sapStatementNo:[''],
        sapStatementStatus:[''],
        documentCode:[''],
        messageLog :[''],
        sapPartner: [''],
        accountDrCode: [''],
        fundReservationLine: ['']
    }

    constructor(
        private router: Router,
        private appParamService: AppParamService,
        private requestReportService: RequestReportService,
        private app: AppComponent,
        public dialogService: DialogService,
        private activatedRoute: ActivatedRoute,
        private helperService: HelperService,
        private welfarePolicyCategoryService: WelfarePolicyCategoryService,
        private service: WelfarePolicyProposalService,
        public modalService: NgbModal
    ) {
        super();
        if (this.router.url.includes('create')) {
            this.create = true;
        }else if (this.router.url.includes('update')) {
            this.update = true;
        } else if (this.router.url.includes('view')) {
            this.view = true;
        }
        this.formSave = this.buildForm({}, this.formConfig);
        this.employeeFilterCondition = " AND 0 = 1 ";
        this.setMainService(this.service);
        console.log(this.activatedRoute.snapshot.paramMap.get('id'))
        console.log(Number(this.activatedRoute.snapshot.paramMap.get('id')))
        if(Number(this.activatedRoute.snapshot.paramMap.get('id'))){
            console.log(2)
            this.service.findOne(Number(this.activatedRoute.snapshot.paramMap.get('id'))).subscribe(res => {
                this.formSave = this.buildForm(res.data, this.formConfig);
                this.status = res.data.status
                if(res.data.spendingOrgId){
                    this.employeeFilterCondition = "AND obj.status = 1 "
                        + "AND obj.organization_id IN (SELECT org.organization_id "
                        + "FROM organization org WHERE org.path LIKE '%/" + this.formSave.get('spendingOrgId').value + "/%')";
                }
                console.log(3)
                this.service.getOrganizationByMassOrganization({proposalOrgId: res.data.proposalOrgId}).subscribe(res => {
                    this.orgOptions = res
                })
                console.log(4)
                this.showBtn = res.data.status === 0 ? true: false;
                if(res.data.status === 6){
                    console.log(5)
                    this.service.listRequestInTableObject({proposalOrgId: res.data.proposalOrgId, welfarePolicyProposalId: res.data.welfarePolicyProposalId}).subscribe(res => {
                        this.buildFormRequest(res)
                        this.fillEmployeeToList()
                        this.fillEmployeeToListByIndividuals();
                    })
                }else{
                    console.log(6)
                    this.buildFormRequest(res.data.list)
                }
            })
        }
        else{
            console.log(7)
            this.buildFormRequest()
            this.formSave = this.buildForm({title:'Đề nghị chi quỹ phúc lợi, công đoàn '+formatDate(new Date(), 'MM/yyyy', 'en-US')}, this.formConfig);
            this.list = new FormArray([])
        }
    }

    ngOnInit() {
        this.receiverTypeOptions = APP_CONSTANTS.RECEIVER_TYPE;
    }

    public goBack() {
        this.router.navigate(['/population/welfare-policy-proposal']);
    }

    get f() {
        return this.formSave.controls;
    }

    callDataForTable(){
        if (CommonUtils.isNullOrEmpty(this.formSave.get('proposalOrgId').value)) {
            return
        }
        if(this.formSave.value.status === 6){
            this.service.listRequestInTableObject({proposalOrgId: this.f['proposalOrgId'].value, welfarePolicyProposalId: this.f['welfarePolicyProposalId'].value}).subscribe(res => {
                this.buildFormRequest(res)
                this.fillEmployeeToList()
                this.fillEmployeeToListByIndividuals();
            })
        }else{
            this.service.listRequestByRuleNotIn({proposalOrgId: this.f['proposalOrgId'].value, welfarePolicyProposalId: this.f['welfarePolicyProposalId'].value}).subscribe(res => {
                this.buildFormRequest(res)
                this.fillEmployeeToList()
                this.fillEmployeeToListByIndividuals();
            })
        }

        this.service.getOrganizationByMassOrganization({proposalOrgId: this.f['proposalOrgId'].value}).subscribe(res => {
            this.orgOptions = res
            if(res.length == 1){
                this.f['spendingOrgId'].setValue(res[0].organizationId)
                this.changeSpendingOrgId()
            }
        })
        this.fillEmployeeToList();
        this.fillEmployeeToListByIndividuals();
    }

    changeSpendingOrgId(){
        if (!CommonUtils.isNullOrEmpty(this.formSave.get('spendingOrgId').value)) {
            this.employeeFilterCondition = "AND obj.status = 1 "
                + "AND obj.organization_id IN (SELECT org.organization_id "
                + "FROM organization org WHERE org.path LIKE '%/" + this.formSave.get('spendingOrgId').value + "/%')";
        }else{
            this.employeeFilterCondition = " AND 0 = 1 ";
        }
        this.fillEmployeeToList();
        this.fillEmployeeToListByIndividuals();
    }

    fillEmployeeToList(){
        if(CommonUtils.isNullOrEmpty(this.formSave.get('proposalOrgId').value) || CommonUtils.isNullOrEmpty(this.formSave.get('receiverEmployeeId').value)
            || (CommonUtils.isNullOrEmpty(this.formSave.get('receiverType').value) && this.formSave.get('receiverType').value === 1)){
            return;
        }else{
            if(this.list.value.length > 0 && this.list.value[0].welfarePolicyRequestId){
                for(const i in this.list.value){
                    this.list.value[i].receiverId = this.formSave.get('receiverEmployeeId').value
                }
            }
            this.buildFormRequest(this.list.value)
        }
    }

    fillEmployeeToListByIndividuals(){
        if(this.formSave.get('receiverType').value === 2){
            if(this.list.value.length > 0 && this.list.value[0].welfarePolicyRequestId){
                for(const i in this.list.value){
                    this.list.value[i].receiverId = this.list.value[i].employeeId
                }
            }
            this.buildFormRequest(this.list.value)
        }else{
            this.fillEmployeeToList()
        }
    }

    private makeDefaultFormRequest(): FormGroup {
        const formSaveRequest = this.buildForm({}, this.formRequest);
        return formSaveRequest;
    }

    private buildFormRequest(list?: any) {
        if (!list || list.length == 0) {
            // this.list = new FormArray([this.makeDefaultFormRequest()]);
        } else {
            this.helperService.isProcessing(true);
            const controls = new FormArray([]);
            for (const i in list) {
                const formTableConfig = list[i];
                const group = this.makeDefaultFormRequest();
                group.patchValue(formTableConfig);
                controls.push(group);
            }
            this.list = controls;
            this.helperService.isProcessing(false);
        }
    }

    public removeRow(index: number, item: FormGroup) {
        const controls = this.list as FormArray;
        if (controls.length === 1) {
            this.buildFormRequest();
            const group = this.makeDefaultFormRequest();
            controls.push(group);
            this.list = controls;
        }
        controls.removeAt(index)
    }

    showPopupAdd(){
        if(this.f['proposalOrgId'].value){
            const modalRef = this.modalService.open(WelfarePolicyProposalPopupAddComponent, MODAL_XL_OPTIONS);
            const data = {
                welfarePolicyProposalId: this.f['welfarePolicyProposalId'].value,
                list: this.list.value,
                proposalOrgId: this.f['proposalOrgId'].value
            }
            modalRef.componentInstance.setFormValue(this.propertyConfigs, data);
            modalRef.result.then((result) => {
                if (!result) {
                    return;
                } else {
                    if(result.length > 0){
                        for(const item in result){
                            if(result[item].isCheck){
                                if(this.list.value[0].welfarePolicyRequestId === ""){
                                    this.list.value.splice(0,1)
                                }
                                this.list.value.push(result[item])
                            }
                        }
                        this.buildFormRequest(this.list.value)
                        this.fillEmployeeToListByIndividuals()
                    }
                }
            });
        }else{
            this.app.warningMessage("","Bạn phải chọn tổ chức đề nghị trước!")
        }

    }

    importData(){
        const modalRef = this.modalService.open(WelfarePolicyProposalPopupImportComponent, DEFAULT_MODAL_OPTIONS);
        const data = {
            proposalOrgId: this.f['proposalOrgId'].value,
            welfarePolicyProposalId: this.f['welfarePolicyProposalId'].value
        }
        modalRef.componentInstance.setFormValue(this.propertyConfigs, data);
        modalRef.result.then((result) => {
            if (!result) {
                return;
            } else {
                this.callDataForTable();
            }
        });
    }

    processSaveOrUpdate() {
        this.checkReceiverType = false
        if(this.formSave.get('receiverType').value === 1 && this.formSave.get('receiverEmployeeId').value === ''){
            this.checkReceiverType = true;
        }
        if(this.formSave.get('receiverType').value === 2 && this.list.value.length > 0){
            for(let item in this.list.value){
                if(!this.list.value[item].receiverId){
                    this.app.warningMessage('',"Người nhận tiền trong danh sách không được để trống khi đối tượng nhận là cá nhân!");
                    return;
                }
            }
        }
        if (!CommonUtils.isValidForm(this.formSave) ||  this.checkReceiverType){
            return
        }
        if(this.list.value[0].welfarePolicyRequestId){
            this.formSave.controls['list'].setValue(this.list.value)
            this.app.confirmMessage(null,
                () => {
                    this.service.saveOrUpdate(this.formSave.value).subscribe(res => {
                        if(res.code === "success" && res.data && res.data.welfarePolicyProposalId){
                            this.router.navigateByUrl(`/population/welfare-policy-proposal/view/${res.data.welfarePolicyProposalId}`);
                        }
                    });
                },
                () => {

                }
            )
        }else{
            this.app.warningMessage('','Danh sách đề nghị chính sách phúc lợi không được rỗng !');
        }
    }

    processSaveOrUpdateAndActSign(){
        this.checkReceiverType = false
        if(this.formSave.get('receiverType').value === 1 && this.formSave.get('receiverEmployeeId').value === ''){
            this.checkReceiverType = true;
        }
        if(this.formSave.get('receiverType').value === 2 && this.list.value.length > 0){
            for(let item in this.list.value){
                if(!this.list.value[item].receiverId){
                    this.app.warningMessage('',"Người nhận tiền trong danh sách không được để trống khi đối tượng nhận là cá nhân!");
                    return;
                }
            }
        }
        if (!CommonUtils.isValidForm(this.formSave) ||  this.checkReceiverType){
            return
        }
        if(this.list.value[0].welfarePolicyRequestId){
            this.formSave.controls['list'].setValue(this.list.value)
            this.app.confirmMessage(null,
                () => {
                    this.service.saveOrUpdate(this.formSave.value).subscribe(res => {
                        if(res.code === "success" && res.data && res.data.signDocumentId){
                            this.router.navigate([`/voffice-signing/welfare-policy-proposal/`, res.data.signDocumentId]);
                        }
                    });
                },
                () => {

                }
            )
        }else{
            this.app.warningMessage('','Danh sách đề nghị chính sách phúc lợi không được rỗng !');
        }
    }

}
