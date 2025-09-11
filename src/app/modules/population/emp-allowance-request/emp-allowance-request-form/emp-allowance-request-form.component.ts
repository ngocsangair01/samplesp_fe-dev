import {Component, OnInit} from '@angular/core';
import {BaseComponent} from "@app/shared/components/base-component/base-component.component";
import {FormArray, FormGroup} from "@angular/forms";
import {ACTION_FORM, APP_CONSTANTS} from "@app/core";
import {ActivatedRoute, Router} from "@angular/router";
import {HelperService} from "@app/shared/services/helper.service";
import {FileControl} from "@app/core/models/file.control";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {RewardCategoryFunding} from "@app/core/services/reward-category/reward-category-funding";
import {CommonUtils, ValidationService} from "@app/shared/services";
import {WelfarePolicyCategoryService} from "@app/core/services/population/welfare-policy-category.service";
import {AllowancePeriodService} from "@app/core/services/population/allowance-period.service";
import {SysCatService} from "@app/core/services/sys-cat/sys-cat.service";
import {WelfarePolicyRequestService} from "@app/core/services/population/welfare-policy-request.service";
import {EmpAllowanceRequestService} from "@app/core/services/population/emp-allowance-request.service";
import {AppComponent} from "@app/app.component";
import {MassOrganizationService} from "@app/core/services/mass-organization/mass-organization.service";

@Component({
    selector: 'emp-allowance-request-form',
    templateUrl: './emp-allowance-request-form.component.html',
    styleUrls: ['./emp-allowance-request-form.component.css']
})
export class EmpAllowanceRequestFormComponent extends BaseComponent implements OnInit {
    formSave: FormGroup;
    empAllowanceRequestId;
    allowanceProposalId;
    view: boolean = false;
    update: boolean = false;
    create: boolean = false;
    branch : number = 3;
    attachmentFileLabel: string;
    empAllowanceRequestAmountBOList: FormArray;
    empAllowanceRequestDocumentList = new FormArray([]);
    requestDocumentTypeOptions;
    welfareCategoryLevelOptions;
    isInvalidFileAttachment: boolean = false;
    isRequiredDesease: boolean = false;
    isRequiredDeseaseCheck: boolean = false;
    fundingCategoryOptions;
    deseaseOptions;
    allowancePeriodOptions;
    massOrgIdByEmp: any = null;
    relationshipOptions: any = [];
    welfarePolicyCategoryList = [];
    isInvalidObjectId: boolean = false;
    isInvalidRelationshipId: boolean = false;
    isInvalidStatus: boolean = false;
    isAllowanceHM: boolean = false;
    isRequiredAllowanceHM: boolean = false;
    isCheckMarriageTime: boolean = false;
    isRequiredChairmanType: boolean = false;
    isRequiredMarriageTime: boolean = false;
    isRequiredTreatmentPlace: boolean = false;
    isRequiredTreatmentTime: boolean = false;
    isRequiredNumberOfTreatments: boolean = false;
    isRequiredIsWorkInCompany: boolean = false;
    objectNameOptions: any = [];
    documentState: any;
    welfarePolicyCategoryInfo;
    relationshipList;
    employeeFilterCondition: any;
    isShowAmount: boolean = true;
    isShowIdPassport: boolean = false;
    formConfig = {
        empAllowanceRequestId: [null],
        employeeId: [null, [ValidationService.required]],
        allowancePeriodId: [null, [ValidationService.required]],
        welfarePolicyCategoryId: [null, [ValidationService.required]],
        objectType: [null, [ValidationService.required]],
        deseaseId: [null],
        relationshipId: [null],
        objectId: [null],
        reason: [null, [ValidationService.required]],
        amountPerBill: [null, [ValidationService.required]],
        amountTotal: [null],
        startDate: [null, [ValidationService.required]],
        endDate: [null],
        approveOrgId: [null, [ValidationService.required]],
        status: [null],
        orgType: [null],
        chairmanType: [null],
        documentState: [null, [ValidationService.required]],
        rejectReason: [null],
        taxableObject: [null, [ValidationService.required]],
        allowanceType: [null, [ValidationService.required]],
        marriageTime: [null],
        treatmentPlace: [null],
        numberOfTreatments: [null],
        treatmentTime: [null],
        idPassport: [null],
        taxNumber: [null],
        isWorkInCompany: [null],
        rejectReasonAllowanceProposal: [null],
        rejectUpdatedByAllowanceProposal: [null],
        rejectUpdatedTimeAllowanceProposal: [null],
        proposeType: [3, [ValidationService.required]],
    }

    isWorkInCompanyOptions = [
        { value: 1, label: 'Có' },
        { value: 2, label: 'Không' }
    ]

    objectTypeOptions = [
        { name: 'Bản thân', value: 1 },
        { name: 'Thân nhân', value: 2 }
    ]
    statusList = [
        { name: 'Dự thảo', value: 0 },
        { name: 'Đã tiếp nhận', value: 2 }
    ]
    statusListFull = [
        { name: 'Dự thảo', value: 0 },
        { name: 'Chờ tiếp nhận', value: 1 },
        { name: 'Đã tiếp nhận', value: 2 },
        { name: 'Bị từ chối', value: 3 },
        { name: 'Chờ thanh toán', value: 5 },
        { name: 'Đã thanh toán', value: 6 }
    ]
    chairmanTypeList : any = [];
    documentStateList = [
        { name: 'Đủ', value: 1 },
        { name: 'Thiếu', value: 2 }
    ]

    taxableObjectList = [
        { name: 'Thân nhân', value: 'TN' },
        { name: 'CBCNV', value: 'NV' }
    ]
    allowanceTypeOptions = [
        { name: 'Hỗ trợ', value: 2 },
        { name: 'Trợ cấp bệnh', value: 3 },
        { name: 'Trợ cấp hiếm muộn', value: 4 },
    ];
    proposeTypeList = [
        { name: 'Tất cả', value: 1 },
        { name: 'Chính sách', value: 2 },
        { name: 'Kinh phí', value: 3 }
    ]


    constructor(
        private router: Router,
        public activatedRoute: ActivatedRoute,
        public helperService: HelperService,
        public rewardCategoryFunding: RewardCategoryFunding,
        public welfarePolicyCategoryService: WelfarePolicyCategoryService,
        public allowancePeriodService: AllowancePeriodService,
        private sysCatService: SysCatService,
        private welfarePolicyRequestService: WelfarePolicyRequestService,
        private empAllowanceRequestService : EmpAllowanceRequestService,
        private massOrganizationService : MassOrganizationService,
        public activeModal: NgbActiveModal,
        private app: AppComponent
    ) {
        super();
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
        if (this.router.url.includes('update') || this.router.url.includes('edit')) {
            this.update = true;
            this.statusList = this.statusListFull
        } else if (this.router.url.includes('view') || this.router.url.includes('view-by-proposal') || this.router.url.includes('view-by-proposal-approval')) {
            this.view = true;
            this.statusList = this.statusListFull
        }
        else if (this.router.url.includes('create')) {
            this.create = true;
        }
        this.rewardCategoryFunding.getListRewardCategoryFunding().subscribe(res => {
            this.fundingCategoryOptions = res;
        });
        if(this.router.url.includes('edit-by-proposal-approval')){
            this.allowancePeriodService.getAllAllowancePeriodSearch().subscribe(res => {
                this.allowancePeriodOptions = res
            })
        } else {
            this.allowancePeriodService.getAllowancePeriod().subscribe(res => {
                this.allowancePeriodOptions = res
            })
        }
        this.sysCatService.findBySysCatTypeId(APP_CONSTANTS.SYS_CAT_TYPE_ID.RELATION_SHIP).subscribe(res => {
            this.relationshipList = res.data;
        });
        this.welfareCategoryLevelOptions = APP_CONSTANTS.WELFARE_CATEGORY_LEVEL;
        if(this.create){
            this.buildForms({});
            this.buildEmpAllowanceRequestAmountBOList();
            this.buildEmpAllowanceRequestDocumentList();
        } else{
            this.empAllowanceRequestId = Number(this.activatedRoute.snapshot.paramMap.get('id'))
            if(this.router.url.includes('edit-by-proposal-approval')) {
                this.allowanceProposalId = Number(this.activatedRoute.snapshot.paramMap.get('allowanceProposalId'))
            }
            this.empAllowanceRequestService.findOne(this.empAllowanceRequestId).subscribe(res => {
                if(res && res.data){
                    if(res.data.relationshipId && res.data.employeeId){
                        this.welfarePolicyRequestService.getObjectNameList(res.data.relationshipId,res.data.employeeId).subscribe(data => {
                            this.objectNameOptions = [];
                            if (data && data.data) {
                                data.data.forEach((item: any) => {
                                    this.objectNameOptions.push({name: item.fullname, value: item.familyRelationshipId});
                                })
                            }
                        });
                    }
                    if(res.data.proposeType && res.data.proposeType === 2){
                        this.isShowAmount = false;
                    }else{
                        this.isShowAmount = true;
                    }

                    if(res.data.taxableObject && res.data.taxableObject === 'TN'){
                        this.isShowIdPassport = true;
                    }else{
                        this.isShowIdPassport = false;
                    }
                    if(this.allowancePeriodOptions){
                        this.allowancePeriodOptions.forEach((item: any)=>{
                            if(item.allowancePeriodId == res.data.allowancePeriodId){
                                this.allowancePeriodService.findOne(item.allowancePeriodId).subscribe(res=>{
                                    this.welfarePolicyCategoryList = res.data.welfarePolicyCategoryBOList
                                    if(item.allowanceType == 3){
                                        this.isRequiredDeseaseCheck = true
                                    }else{
                                        this.isRequiredDeseaseCheck = false
                                    }
                                    if(res && res.data){
                                        if(res.data.orgType === 2){
                                            this.branch = 3
                                        }else if(res.data.orgType === 3){
                                            this.branch = 1
                                        }else if(res.data.orgType === 4){
                                            this.branch = 2
                                        }else if(res.data.orgType === 1){
                                            this.branch = 0
                                        }
                                    }
                                })
                            }
                        })
                    }
                    this.welfarePolicyCategoryService.getPolicyDesease(res.data.welfarePolicyCategoryId).subscribe(res => {
                        this.deseaseOptions =  res.data
                    })
                    this.welfarePolicyCategoryService.findOptionBean(res.data.welfarePolicyCategoryId).subscribe(res => {
                        if(res && res.data){
                            if (res.data.employeeStatus && (res.data.employeeStatus === 1 || res.data.employeeStatus === 2)) {
                                this.employeeFilterCondition = ` AND obj.status = ${res.data.employeeStatus}`;
                                if(res.data.employeeStatus === 2){
                                    this.employeeFilterCondition += ` and obj.employee_id in ( select e.employee_id from employee e 
                                                  join work_process wp on wp.employee_id = e.employee_id
                                                  where CURDATE() BETWEEN wp.effective_start_date AND COALESCE(wp.effective_end_date,CURDATE())
                                                  and (0=1 or wp.document_type_id = 389 or wp.document_type_id = 833)
                                                  and wp.document_reason_id = 1140) `;
                                }
                            } else {
                                this.employeeFilterCondition = '';
                            }
                            this.welfarePolicyCategoryInfo = res.data;
                            this.setDataListChairmanType(res.data.welfarePolicyNormBOList)
                            if(res.data.type === 4){
                                this.isAllowanceHM = true;
                            }
                            let listRelationship: any = [];
                            this.relationshipOptions = []
                            if(res.data.relationShipList){
                                res.data.relationShipList.forEach((ele: any) => {
                                    listRelationship.push(this.relationshipList.filter((item: any) => item.sysCatId === ele)[0])
                                })
                            }
                            this.relationshipOptions = listRelationship;
                            // set list file
                            this.requestDocumentTypeOptions = res.data.policyDocumentBOList;
                            this.attachmentFileLabel = '';
                            if (res.data.policyDocumentBOList && res.data.policyDocumentBOList.length) {
                                this.attachmentFileLabel = 'Loại giấy tờ yêu cầu cần: ';
                                let label = '';
                                if(res.data.policyDocumentBOList){
                                    res.data.policyDocumentBOList.forEach((item: any) => {
                                        if (item.isRequired === 1) {
                                            label += item.name + '; ';
                                        }
                                    })
                                    if (label) {
                                        this.attachmentFileLabel += label;
                                    }
                                }
                            }
                        }
                    })
                    this.buildForms(res.data);
                    this.allowancePeriodService.findOne(this.formSave.controls['allowancePeriodId'].value).subscribe(res=>{
                        this.welfarePolicyCategoryList = res.data.welfarePolicyCategoryBOList
                    })
                    if(res.data.empAllowanceRequestAmountBOList.length === 0){
                        this.buildEmpAllowanceRequestAmountBOList()
                    }else{
                        this.buildEmpAllowanceRequestAmountBOList(res.data.empAllowanceRequestAmountBOList)
                    }
                    if(res.data.empAllowanceRequestDocumentList.length === 0){
                        this.welfarePolicyCategoryService.findOptionBean(res.data.welfarePolicyCategoryId).subscribe(res => {
                            if (res && res.data) {
                                this.buildEmpAllowanceRequestDocumentList(res.data.policyDocumentBOList)
                            }else{
                                this.buildEmpAllowanceRequestDocumentList()
                            }
                        })
                    }else{
                        this.buildEmpAllowanceRequestDocumentList(res.data.empAllowanceRequestDocumentList)
                    }
                }
            })
        }

    }


    private createDefaultEmpAllowanceRequestAmountBOList(): FormGroup {
        const group = {
            empAllowanceRequestAmountId: [null],
            empAllowanceRequestId: [null],
            welfarePolicyNormId: [null],
            fundingCategoryId: [null],
            level: [null],
            isFixed: [null],
            optionLevel: [null],
            amount: [null, [ValidationService.required]],
        };
        return this.buildForm({}, group);
    }

    private buildEmpAllowanceRequestAmountBOList(empAllowanceRequestAmountBOList?: any): void {
        if (!empAllowanceRequestAmountBOList) {
            this.empAllowanceRequestAmountBOList = new FormArray([this.createDefaultEmpAllowanceRequestAmountBOList()]);
        } else {
            const controls = new FormArray([]);
            for (const item of empAllowanceRequestAmountBOList) {
                const group = this.createDefaultEmpAllowanceRequestAmountBOList();
                group.patchValue(item);
                controls.push(group);
            }
            this.empAllowanceRequestAmountBOList = controls;
        }
    }

    private createDefaultEmpAllowanceRequestDocumentList(): FormGroup {
        const group = {
            empAllowanceRequestDocumentId: [null],
            empAllowanceRequestId: [null],
            policyDocumentId: [null],
            isRequired: [null],
            attachmentFileId: [null],
            isDeleted: [1],
            file: new FileControl(null),
        };
        return this.buildForm({}, group);
    }

    private buildEmpAllowanceRequestDocumentList(empAllowanceRequestDocumentList?: any): void {
        if (!empAllowanceRequestDocumentList) {
            this.empAllowanceRequestDocumentList = new FormArray([this.createDefaultEmpAllowanceRequestDocumentList()]);
        } else {
            this.empAllowanceRequestDocumentList = new FormArray([]);
            for (const item of empAllowanceRequestDocumentList) {
                const group = this.createDefaultEmpAllowanceRequestDocumentList();
                const filesControl = new FileControl(null);
                if (item && item.fileAttachment && item.fileAttachment.file) {
                    filesControl.setFileAttachment(item.fileAttachment.file);
                    filesControl.setValue(item.fileAttachment.file[0]);
                    Object.assign(item, {file: item.fileAttachment.file[0]})
                }else if(item && item.fileAttachment && item.fileAttachment.length > 0){
                    filesControl.setFileAttachment(item.fileAttachment);
                    filesControl.setValue(item.fileAttachment[0]);
                    Object.assign(item, {file: item.fileAttachment[0]})
                }
                group.patchValue(item);
                group.setControl('file', filesControl);
                this.empAllowanceRequestDocumentList.push(group);
            }
        }
    }

    ngOnInit() {
    }

    get f() {
        return this.formSave.controls;
    }

    buildForms(data?: any) {
        this.formSave = this.buildForm(data, this.formConfig, ACTION_FORM.INSERT);
    }

    processSaveOrUpdate() {
        if(!CommonUtils.isValidForm(this.formSave)){
            return;
        }
        if (this.formSave.get('status').value === null) {
            this.isInvalidStatus = true;
            return;
        }
        if (this.formSave.get('taxableObject').value === 'TN') {
            if (this.formSave.get('idPassport').value === null) {
                this.app.warningMessage("","Căn cước công dân không được để trống!");
                return;
            }
            if (this.formSave.get('taxNumber').value === null) {
                this.app.warningMessage("","Mã số thuế không được để trống!");
                return;
            }
            
        }
        
        this.documentState = this.formSave.get('documentState').value
        this.isInvalidFileAttachment = false;
        if (this.empAllowanceRequestDocumentList.value) {
            this.empAllowanceRequestDocumentList.value.forEach((item: any) => {
                if (this.documentState === 2) {
                    this.isInvalidFileAttachment = false;
                } else {
                    this.documentState = 1
                    if (item.isRequired === 1 && (!item.file || (item.file && !item.file.type)) && item.isDeleted == 1) {
                        this.isInvalidFileAttachment = true;
                    }
                }
            })
        }
        if((this.isRequiredDeseaseCheck && !this.formSave.get('deseaseId').value)
            || (!this.formSave.get('deseaseId').value && this.formSave.value.allowanceType && this.formSave.value.allowanceType == 4)){
            this.isRequiredDesease = true
        }else{
            this.isRequiredDesease = false
        }

        if(this.formSave.value.proposeType && this.formSave.value.proposeType !== 2 && !this.formSave.value.chairmanType){
            this.isRequiredChairmanType = true;
        }else{
            this.isRequiredChairmanType = false;
        }
        if(this.formSave.value.allowanceType && this.formSave.value.allowanceType == 4 &&
            (!this.formSave.value.marriageTime || !this.formSave.value.treatmentTime
                || !this.formSave.value.numberOfTreatments || !this.formSave.value.isWorkInCompany)){
            if(!this.formSave.value.marriageTime){
                this.isRequiredMarriageTime = true
            }else{
                this.isRequiredMarriageTime = false
            }
            if(!this.formSave.value.treatmentTime){
                this.isRequiredTreatmentTime = true
            }else{
                this.isRequiredTreatmentTime = false
            }
            if(!this.formSave.value.numberOfTreatments){
                this.isRequiredNumberOfTreatments = true
            }else{
                this.isRequiredNumberOfTreatments = false
            }
            if(!this.formSave.value.isWorkInCompany){
                this.isRequiredIsWorkInCompany = true
            }else{
                this.isRequiredIsWorkInCompany = false
            }
            this.isRequiredAllowanceHM = true
        }else{
            this.isRequiredAllowanceHM = false;
        }
        if(this.formSave.value.amountPerBill && this.formSave.value.amountPerBill < 0){
            this.app.warningMessage('',"Tổng tiền trên hóa đơn không được nhỏ hơn giá trị 0!");
            return;
        }
        if (this.formSave.get('objectType').value === 2 && !this.formSave.get('relationshipId').value) {
            this.isInvalidRelationshipId = true;
        }
        if (this.formSave.get('objectType').value === 2 && !this.formSave.get('objectId').value) {
            this.isInvalidObjectId = true;
        }
        if(this.isInvalidFileAttachment || this.isInvalidObjectId || this.isInvalidRelationshipId || !CommonUtils.isValidForm(this.formSave) || this.isRequiredDesease || this.isRequiredAllowanceHM
           || (this.isRequiredChairmanType && !CommonUtils.isValidForm(this.empAllowanceRequestAmountBOList)) || !CommonUtils.isValidForm(this.empAllowanceRequestDocumentList)){
            return;
        }
        var formData: any = {};
        if (!CommonUtils.isNullOrEmpty(this.formSave.get('empAllowanceRequestId').value)) {
            formData['empAllowanceRequestId'] = this.formSave.get('empAllowanceRequestId').value;
        }
        if(this.empAllowanceRequestDocumentList.value.length > 0){
            this.empAllowanceRequestDocumentList.value.forEach((item: any) => {
                if(item.file == null){
                    item.attachmentFileId = 0;
                }
            })
        }
        formData['employeeId'] = this.formSave.get('employeeId').value;
        formData['allowancePeriodId'] = this.formSave.get('allowancePeriodId').value;
        formData['welfarePolicyCategoryId'] = this.formSave.get('welfarePolicyCategoryId').value;
        formData['objectType'] = this.formSave.get('objectType').value;
        formData['deseaseId'] = this.formSave.get('deseaseId').value;
        formData['relationshipId'] = this.formSave.get('relationshipId').value;
        formData['objectId'] = this.formSave.get('objectId').value;
        formData['reason'] = this.formSave.get('reason').value;
        formData['amountPerBill'] = this.formSave.get('amountPerBill').value;
        formData['amountTotal'] = this.formSave.get('amountTotal').value;
        formData['startDate'] = this.formSave.get('startDate').value;
        formData['endDate'] = this.formSave.get('endDate').value;
        formData['approveOrgId'] = this.formSave.get('approveOrgId').value;
        formData['status'] = this.formSave.get('status').value;
        formData['orgType'] = this.formSave.get('orgType').value;
        formData['chairmanType'] = this.formSave.get('chairmanType').value;
        formData['documentState'] = this.formSave.get('documentState').value;
        formData['taxableObject'] = this.formSave.get('taxableObject').value;
        formData['taxNumber'] = this.formSave.get('taxNumber').value;
        formData['idPassport'] = this.formSave.get('idPassport').value;
        formData['rejectReason'] = this.formSave.get('rejectReason').value;
        formData['allowanceType'] = this.formSave.get('allowanceType').value;
        formData['marriageTime'] = this.formSave.get('marriageTime').value;
        formData['treatmentPlace'] = this.formSave.get('treatmentPlace').value;
        formData['numberOfTreatments'] = this.formSave.get('numberOfTreatments').value;
        formData['allowanceProposalId'] = this.allowanceProposalId;
        formData['treatmentTime'] = this.formSave.get('treatmentTime').value;
        formData['isWorkInCompany'] = this.formSave.get('isWorkInCompany').value;
        formData['proposeType'] = this.formSave.get('proposeType').value;
        formData['empAllowanceRequestDocumentList'] = this.empAllowanceRequestDocumentList.value;
        formData['empAllowanceRequestAmountBOList'] = this.empAllowanceRequestAmountBOList.value;
        this.app.confirmMessage(null,
            () => {
                this.empAllowanceRequestService.saveOrUpdateFormFile(formData).subscribe(res => {
                    if(res.code === "success" && res.data && res.data.empAllowanceRequestId){
                        this.router.navigate(['/population/emp-allowance-request/view', res.data.empAllowanceRequestId])
                    }
                });
            },
            () => {

            }
        )
    }

    setDataListChairmanType(list){
        let checkType1 = false;
        let checkType2 = false;
        let checkType3 = false;
        this.chairmanTypeList = []
        for(let item in list){
            if(list[item].chairmanType == 1 && !checkType1){
                this.chairmanTypeList.push({ name: 'Ban giám đốc', value: 1 });
                checkType1 = true
            }
            if(list[item].chairmanType == 2 && !checkType2){
                this.chairmanTypeList.push({ name: 'Đơn vị', value: 2 });
                checkType2 = true
            }
            if(list[item].chairmanType == 3 && !checkType3){
                this.chairmanTypeList.push({ name: 'Tập đoàn', value: 3 });
                checkType3 = true
            }
            if(checkType1 && checkType2 && checkType3){
                break;
            }
        }
    }

    changeChairmanType(event: any) {
        if (event) {
            let welfarePolicyNormBOList = [];
            if (this.welfarePolicyCategoryInfo && this.welfarePolicyCategoryInfo.welfarePolicyNormBOList) {
                welfarePolicyNormBOList = this.welfarePolicyCategoryInfo.welfarePolicyNormBOList.filter((item: any) => item.chairmanType === event);
                this.buildEmpAllowanceRequestAmountBOList(welfarePolicyNormBOList);
            } else {
                this.buildEmpAllowanceRequestAmountBOList();
            }
        } else {
            this.buildEmpAllowanceRequestAmountBOList();
        }
    }

    onChangeEmployee(event: any) {
        if(event && event.selectField){
            this.formSave.get('approveOrgId').setValue(null);
            this.formSave.controls['approveOrgId'].setValue(null);
            this.massOrgIdByEmp = null
            this.massOrganizationService.getListMassOrgByEmployeeId(event.selectField, this.branch).subscribe(res =>{
                if(res && res.length > 0){
                    this.formSave.controls['approveOrgId'].setValue(res[0].massOrganizationId);
                    const arr = res[0].orgPath.split('/');
                    this.massOrgIdByEmp =  arr[0] != ""? arr[0]: arr[1];
                }
            });
        }
        this.changeRelationshipId();
    }

    onFileChange(event: any) {
        if (event) {
            this.isInvalidFileAttachment = false;
        }
    }

    changeObjectId(event: any){
        if(event){
            this.isInvalidObjectId = false;
        }
    }

    changeRelationshipId(){
        if(this.formSave.controls['relationshipId'].value && this.formSave.controls['employeeId'].value){
            this.isInvalidRelationshipId = false;
            this.welfarePolicyRequestService.getObjectNameList(this.formSave.controls['relationshipId'].value,this.formSave.controls['employeeId'].value).subscribe(data => {
                this.objectNameOptions = [];
                if (data && data.data) {
                    data.data.forEach((item: any) => {
                        this.objectNameOptions.push({name: item.fullname, value: item.familyRelationshipId});
                    })
                }
                this.formSave.get('objectId').setValue(null);
            });
        }else{
            this.objectNameOptions = [];
            this.formSave.get('objectId').setValue(null);
        }
    }

    changeAllowancePeriod(event: any){
        if(event &&  this.allowancePeriodOptions){
            this.allowancePeriodOptions.forEach((item: any)=>{
                if(item.allowancePeriodId == this.formSave.controls['allowancePeriodId'].value){
                    this.formSave.get('allowanceType').setValue(item.allowanceType)
                    if(item.allowanceType == 3){
                        this.isRequiredDeseaseCheck = true
                    }else{
                        this.isRequiredDeseaseCheck = false
                    }
                    this.allowancePeriodService.findOne(item.allowancePeriodId).subscribe(res=>{
                        this.welfarePolicyCategoryList = res.data.welfarePolicyCategoryBOList
                        if(res && res.data){
                            if(res.data.orgType === 2){
                                this.branch = 3
                            }else if(res.data.orgType === 3){
                                this.branch = 1
                            }else if(res.data.orgType === 4){
                                this.branch = 2
                            }else if(res.data.orgType === 1){
                                this.branch = 0
                            }
                            if(res.data.allowanceType === 4){
                                this.isAllowanceHM = true
                            }else{
                                this.isAllowanceHM = false
                                this.formSave.get('proposeType').setValue(3);
                            }
                        }
                    })
                }
            })
        }

    }

    changeWelfarePolicyCategory(event: any){
        if(event){
            this.isInvalidRelationshipId = false;
            this.welfarePolicyCategoryService.getPolicyDesease(this.formSave.controls['welfarePolicyCategoryId'].value).subscribe(res => {
                this.deseaseOptions =  res.data
            })
            this.welfarePolicyCategoryService.findOptionBean(this.formSave.controls['welfarePolicyCategoryId'].value).subscribe(res => {
                this.formSave.get('objectType').setValue(res.data.objectType)
                this.formSave.get('orgType').setValue(res.data.orgType)
                if(res && res.data){
                    if(res.data.type === 4){
                        this.isAllowanceHM = true
                    }else{
                        this.isAllowanceHM = false
                    }
                    if (res.data.employeeStatus && (res.data.employeeStatus === 1 || res.data.employeeStatus === 2)) {
                        this.employeeFilterCondition = ` AND obj.status = ${res.data.employeeStatus}`;
                        if(res.data.employeeStatus === 2){
                            this.employeeFilterCondition += ` and obj.employee_id in ( select e.employee_id from employee e 
                                                  join work_process wp on wp.employee_id = e.employee_id
                                                  where CURDATE() BETWEEN wp.effective_start_date AND COALESCE(wp.effective_end_date,CURDATE())
                                                  and (0=1 or wp.document_type_id = 389 or wp.document_type_id = 833)
                                                  and wp.document_reason_id = 1140) `;
                        }
                    } else {
                        this.employeeFilterCondition = '';
                    }
                    this.welfarePolicyCategoryInfo = res.data;
                    this.setDataListChairmanType(res.data.welfarePolicyNormBOList)
                    let listRelationship: any = [];
                    this.relationshipOptions = []
                    if(res.data.relationShipList){
                        res.data.relationShipList.forEach((ele: any) => {
                            listRelationship.push(this.relationshipList.filter((item: any) => item.sysCatId === ele)[0])
                        })
                    }
                    this.relationshipOptions = listRelationship;
                    this.changeRelationshipId();
                    // set list file
                    this.requestDocumentTypeOptions = res.data.policyDocumentBOList;
                    this.attachmentFileLabel = '';
                    if (res.data.policyDocumentBOList && res.data.policyDocumentBOList.length) {
                        this.attachmentFileLabel = 'Loại giấy tờ yêu cầu cần: ';
                        let label = '';
                        if(res.data.policyDocumentBOList){
                            res.data.policyDocumentBOList.forEach((item: any) => {
                                if (item.isRequired === 1) {
                                    label += item.name + '; ';
                                }
                            })
                            if (label) {
                                this.attachmentFileLabel += label;
                            }
                        }
                    }
                    if(res.data.policyDocumentBOList.length === 0){
                        this.buildEmpAllowanceRequestDocumentList()
                    }else{
                        this.buildEmpAllowanceRequestDocumentList(res.data.policyDocumentBOList)
                    }
                    // set list nguồn kinh phí
                    if(res.data.welfarePolicyNormBOList.length === 0){
                        this.buildEmpAllowanceRequestAmountBOList()
                    }else{
                        this.buildEmpAllowanceRequestAmountBOList(res.data.welfarePolicyNormBOList)
                    }
                    this.changeChairmanType(this.formSave.get('chairmanType').value);
                }
            })
        }
    }

    changeLevelList(list?: any, i?: any){
        if(list && list.value[i].welfarePolicyNormId){
            this.welfarePolicyCategoryService.findWelfarePolicyNormById(list.value[i].welfarePolicyNormId, list.value[i].level).subscribe( res => {
                if(res && res.data){
                    list.value[i].isFixed = res.data.isFixed
                    list.value[i].amount = res.data.amount
                    this.buildEmpAllowanceRequestAmountBOList(list.value)
                }
            })
        }
    }

    goBack() {
        if(this.router.url.includes('view-by-proposal') && !this.router.url.includes('view-by-proposal-approval')&& !this.router.url.includes('view-by-proposal-sign')){
            this.router.navigate(['/population/allowance-proposal/view', Number(this.activatedRoute.snapshot.paramMap.get('otherId'))])
        }else if(this.router.url.includes('view-by-proposal-approval')){
            this.router.navigate(['/population/allowance-proposal-approval/view', Number(this.activatedRoute.snapshot.paramMap.get('otherId'))])
        }else if(this.router.url.includes('view-by-proposal-sign')){
            this.router.navigate(['/population/allowance-proposal-sign/view', Number(this.activatedRoute.snapshot.paramMap.get('otherId'))])
        }else{
            this.router.navigate(['/population/emp-allowance-request']);
        }
    }

    navigate() {
        this.router.navigate(['/population/emp-allowance-request/edit', this.empAllowanceRequestId])
    }

    changeRequiredDesease(event){
        if(event){
            this.isRequiredDesease = false;
        }
    }

    public addRow(index: number, item: FormGroup) {
        const controls = this.empAllowanceRequestDocumentList as FormArray;
        const group = {
            welfarePolicyRequestId: [null],
            policyDocumentRequestId: [null],
            policyDocumentId: [null],
            isRequired: [null],
            isDeleted: [1],
            file: new FileControl(null),
        };
        const data = {
            welfarePolicyRequestId: item.value.welfarePolicyRequest,
            policyDocumentRequestId: [null],
            policyDocumentId: item.value.policyDocumentId,
            isRequired: item.value.isRequired,
            isDeleted: 1,
            file: new FileControl(null),
        };
        controls.insert(index + 1, this.buildForm(data, group));
    }

    public removeRow(index: number, item: FormGroup) {
        let count = 0
        for(let i in this.empAllowanceRequestDocumentList.value){
            if(this.empAllowanceRequestDocumentList.value[i].isDeleted == 1 && this.empAllowanceRequestDocumentList.value[i].policyDocumentId == item.value.policyDocumentId){
                count++;
            }
        }
        if(count > 1){
            this.empAllowanceRequestDocumentList.value[index].isDeleted = 0
            this.empAllowanceRequestDocumentList.value[index].fileAttachment = null
        }
    }

    processDownloadTemplate(id?: number){
        if(id){
            if(id == 1){
                this.empAllowanceRequestService.downloadTemplateImport(id).subscribe(res => {
                    saveAs(res, 'Mau 01_Ke khai ho tro hiem muon cua ca nhan.docx');
                });
            }else if(id == 2){
                this.empAllowanceRequestService.downloadTemplateImport(id).subscribe(res => {
                    saveAs(res, 'Mau 02_Ke khai ho tro vo sinh nhan con nuoi.docx');
                });
            }
        }
    }

    changeProposeType(event?: any){
        if(event){
            if(event === 2){
                this.isShowAmount = false
            }else{
                this.isShowAmount = true
            }
        }
    }

    changeTaxableObject(event?: any){
        if(event){
            if(event === 'TN'){
                this.isShowIdPassport = true
            }else{
                this.isShowIdPassport = false
            }
        }
    }

    /**
     * Bổ sung cảnh báo dưới thời gian kết hôn: Nếu thời gian kết hôn dưới 3 năm
     */
    changeMarriageTime(){
        if(this.formSave.value.marriageTime){
            let checkDate = new Date(new Date().getFullYear()-3, new Date().getMonth(), new Date().getDate())
            if(checkDate.getTime() - this.formSave.value.marriageTime < 0){
                this.isCheckMarriageTime = true;
            }else {
                this.isCheckMarriageTime = false;
            }
        }else {
            this.isCheckMarriageTime = false;
        }
    }

    changeStatus(event: any) {
        if (event !== null) {
            this.isInvalidStatus = false;
        } else {
            this.isInvalidStatus = true;
        }
    }
}
