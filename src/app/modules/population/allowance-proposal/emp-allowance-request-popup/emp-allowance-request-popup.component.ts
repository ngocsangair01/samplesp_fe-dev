import {Component, Input, OnInit} from '@angular/core';
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
import {AppParamService} from "@app/core/services/app-param/app-param.service";

@Component({
    selector: 'emp-allowance-request-popup',
    templateUrl: './emp-allowance-request-popup.component.html',
    styleUrls: ['./emp-allowance-request-popup.component.css']
})
export class EmpAllowanceRequestPopupComponent extends BaseComponent implements OnInit {
    formSave: FormGroup;
    empAllowanceRequestId;
    type;
    attachmentFileLabel: string;
    empAllowanceRequestAmountBOList: FormArray;
    empAllowanceRequestDocumentList: FormArray  = new FormArray([]);
    requestDocumentTypeOptions;
    isInvalidFileAttachment: boolean = false;
    fundingCategoryOptions;
    deseaseOptions;
    welfarePolicyCategoryInfo;
    allowancePeriodOptions;
    relationshipOptions: any = [];
    welfarePolicyCategoryList = [];
    isValidRejectReason: boolean = false;
    objectNameOptions: any = [];
    relationshipList;
    welfareCategoryLevelOptions;
    listDocument: any = [];
    listPolicyDocumentId: any = [];
    formConfig = {
        empAllowanceRequestId: [null],
        employeeId: [null, [ValidationService.required]],
        allowancePeriodId: [null, [ValidationService.required]],
        welfarePolicyCategoryId: [null, [ValidationService.required]],
        objectType: [null, [ValidationService.required]],
        deseaseId: [null, [ValidationService.required]],
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
        chairmanType: [null, [ValidationService.required]],
        documentState: [null, [ValidationService.required]],
        rejectReason: [null],
        allowanceType: [null, [ValidationService.required]],
        proposeType: [null],
    }
    objectTypeOptions = [
        { name: 'Bản thân', value: 1 },
        { name: 'Thân nhân', value: 2 }
    ]
    statusList = [
        { name: 'Dự thảo', value: 0 },
        { name: 'Đã tiếp nhận', value: 2 },
        { name: 'Đã thăm hỏi', value: 4 }
    ]
    chairmanTypeList : any = [];
    documentStateList = [
        { name: 'Đủ', value: 1 },
        { name: 'Thiếu', value: 2 }
    ]
    allowanceTypeOptions = [];

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
        public activeModal: NgbActiveModal,
        private appParamService : AppParamService,
        private app: AppComponent
    ) {
        super();
        this.buildForms({});
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
    }

    setFormValue(data) {
        if (data) {
            this.empAllowanceRequestId = data.empAllowanceRequestId;
            this.type = data.type
            this.welfareCategoryLevelOptions = APP_CONSTANTS.WELFARE_CATEGORY_LEVEL;
            this.rewardCategoryFunding.getListRewardCategoryFunding().subscribe(res => {
                this.fundingCategoryOptions = res;
            });
            this.allowancePeriodService.getAllowancePeriod().subscribe(res => {
                this.allowancePeriodOptions = res
            })
            this.sysCatService.findBySysCatTypeId(APP_CONSTANTS.SYS_CAT_TYPE_ID.RELATION_SHIP).subscribe(res => {
                this.relationshipList = res.data;
            });
            this.empAllowanceRequestService.findOne(this.empAllowanceRequestId).subscribe(res => {
                if(res && res.data){
                    this.changeChairmanType(res.data.chairmanType)
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
                    if(this.allowancePeriodOptions){
                        this.allowancePeriodOptions.forEach((item: any)=>{
                            if(item.allowancePeriodId == res.data.allowancePeriodId){
                                this.allowancePeriodService.findOne(item.allowancePeriodId).subscribe(res=>{
                                    this.welfarePolicyCategoryList = res.data.welfarePolicyCategoryBOList
                                })
                            }
                        })
                    }
                    this.welfarePolicyCategoryService.getPolicyDesease(res.data.welfarePolicyCategoryId).subscribe(res => {
                        this.deseaseOptions =  res.data
                    })
                    this.welfarePolicyCategoryService.findOptionBean(res.data.welfarePolicyCategoryId).subscribe(res => {
                        if(res && res.data){
                            this.welfarePolicyCategoryInfo = res.data;
                            this.setDataListChairmanType(res.data.welfarePolicyNormBOList)
                            let listRelationship: any = [];
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
                    if(res.data.empAllowanceRequestAmountBOList.length === 0){
                        this.buildEmpAllowanceRequestAmountBOList()
                    }else{
                        this.buildEmpAllowanceRequestAmountBOList(res.data.empAllowanceRequestAmountBOList)
                    }
                    if(res.data.empAllowanceRequestDocumentList.length === 0){
                        this.welfarePolicyCategoryService.findOne(res.data.welfarePolicyCategoryId).subscribe(res => {
                            if(this.type == 3){
                                if (res && res.data) {
                                    this.buildEmpAllowanceRequestDocumentList(res.data.policyDocumentBOList, res.data.welfarePolicyCategoryId)
                                }else{
                                    this.buildEmpAllowanceRequestDocumentList()
                                }
                            }
                        })
                    }else{
                        if(this.type == 3) {
                            this.buildEmpAllowanceRequestDocumentList(res.data.empAllowanceRequestDocumentList, res.data.welfarePolicyCategoryId)
                        }
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
            isView: [null],
            attachmentFileId: [null],
            isDeleted: [1],
            file: new FileControl(null),
        };
        return this.buildForm({}, group);
    }

    private buildEmpAllowanceRequestDocumentList(empAllowanceRequestDocumentList?: any, welfarePolicyCategoryId?: any): void {
        if (!empAllowanceRequestDocumentList) {
            this.empAllowanceRequestDocumentList = new FormArray([this.createDefaultEmpAllowanceRequestDocumentList()]);
        } else {
            if(welfarePolicyCategoryId){
                this.appParamService.findAllByParType('LOAI_GIAY_TO_BO_SUNG').subscribe(res1 => {
                    if(res1 && res1.data){
                        for(let item in res1.data){
                            this.listDocument.push(res1.data[item].parCode)
                        }
                        this.welfarePolicyCategoryService.findOne(welfarePolicyCategoryId).subscribe(res => {
                            if (res && res.data) {
                                for(const item of res.data.policyDocumentBOList){
                                    if(this.listDocument.includes(item.code)){
                                        this.listPolicyDocumentId.push(item.policyDocumentId)
                                    }
                                }
                                this.empAllowanceRequestDocumentList = new FormArray([]);
                                for (const item of empAllowanceRequestDocumentList) {
                                    if(this.listPolicyDocumentId.includes(item.policyDocumentId)){
                                        Object.assign(item, {isView: false})
                                    }else{
                                        Object.assign(item, {isView: true})
                                    }
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
                        })
                    }
                })
            }

        }
    }

    ngOnInit() {
    }

    buildForms(data?: any) {
        this.formSave = this.buildForm(data, this.formConfig, ACTION_FORM.INSERT);
    }

    get f() {
        return this.formSave.controls;
    }

    onFileChange(event: any) {
        if (event) {
            this.isInvalidFileAttachment = false;
        }
    }

    processSaveOrUpdate() {
        if(this.type === 1){
            if(this.formSave.value.proposeType && this.formSave.value.proposeType != 2 && !CommonUtils.isValidForm(this.empAllowanceRequestAmountBOList)){
                return;
            }
        }else if(this.type === 3){
            if(!CommonUtils.isValidForm(this.empAllowanceRequestDocumentList)){
                return;
            }
        }else{
            if(this.formSave.value.rejectReason == null || this.formSave.value.rejectReason == ""){
                this.isValidRejectReason = true;
                return;
            }
        }
        var formData: any = {};
        if( this.type ==3 && this.empAllowanceRequestDocumentList.value.length > 0){
            if(this.empAllowanceRequestDocumentList.value){
                this.empAllowanceRequestDocumentList.value.forEach((item: any) => {
                    if(item.file == null){
                        item.attachmentFileId = 0;
                    }
                })
            }
        }
        if (!CommonUtils.isNullOrEmpty(this.formSave.get('empAllowanceRequestId').value)) {
            formData['empAllowanceRequestId'] = this.formSave.get('empAllowanceRequestId').value;
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
        if(this.type === 1){
            formData['status'] = 2;
            formData['type'] = 1;
        }else if(this.type === 2){
            formData['status'] = 3;
            formData['type'] = 2;
        }else{
            formData['status'] = this.formSave.get('status').value;
            formData['type'] = 3;
        }
        formData['orgType'] = this.formSave.get('orgType').value;
        formData['chairmanType'] = this.formSave.get('chairmanType').value;
        formData['documentState'] = this.formSave.get('documentState').value;
        formData['rejectReason'] = this.formSave.get('rejectReason').value;
        formData['allowanceType'] = this.formSave.get('allowanceType').value;
        formData['empAllowanceRequestDocumentList'] = this.empAllowanceRequestDocumentList.value;
        formData['empAllowanceRequestAmountBOList'] = this.empAllowanceRequestAmountBOList.value;
        this.app.confirmMessage(null,
            () => {
                this.empAllowanceRequestService.updateStatus(formData).subscribe(res => {
                    if(res.code === "success"){
                        this.activeModal.close()
                    }
                });
            },
            () => {

            }
        )
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

    changeLevelList(list?: any, i?: any) {
        if (list && list.value[i].welfarePolicyNormId) {
            this.welfarePolicyCategoryService.findWelfarePolicyNormById(list.value[i].welfarePolicyNormId, list.value[i].level).subscribe(res => {
                if (res && res.data) {
                    list.value[i].isFixed = res.data.isFixed
                    list.value[i].amount = res.data.amount
                    this.buildEmpAllowanceRequestAmountBOList(list.value)
                }
            })
        }
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
                checkType2 = true
            }
            if(checkType1 && checkType2 && checkType3){
                break;
            }
        }
    }

    goBack() {
        this.router.navigate(['/population/emp-allowance-request']);
    }

    public addRow(index: number, item: FormGroup) {
        const controls = this.empAllowanceRequestDocumentList as FormArray;
        const group = {
            welfarePolicyRequestId: [null],
            policyDocumentRequestId: [null],
            policyDocumentId: [null],
            isRequired: [null],
            isView: [null],
            isDeleted: [1],
            file: new FileControl(null),
        };
        const data = {
            welfarePolicyRequestId: item.value.welfarePolicyRequest,
            policyDocumentRequestId: [null],
            policyDocumentId: item.value.policyDocumentId,
            isRequired: item.value.isRequired,
            isView: item.value.isView,
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
            let list = []
            for(let item of this.empAllowanceRequestDocumentList.controls){
                let data : any = item.get("file")
                const group = {
                    empAllowanceRequestDocumentId: item.value.empAllowanceRequestDocumentId,
                    empAllowanceRequestId: item.value.empAllowanceRequestId,
                    policyDocumentId: item.value.policyDocumentId,
                    attachmentFileId: item.value.attachmentFileId,
                    isRequired: item.value.isRequired,
                    isView: item.value.isView,
                    isDeleted: item.value.isDeleted,
                    fileAttachment: data.fileAttachment,
                };
                list.push(group)
            }
            list[index].fileAttachment = null
            list[index].isDeleted = 0
            this.buildEmpAllowanceRequestDocumentList(list, this.welfarePolicyCategoryInfo.welfarePolicyCategoryId);
        }
    }
}
