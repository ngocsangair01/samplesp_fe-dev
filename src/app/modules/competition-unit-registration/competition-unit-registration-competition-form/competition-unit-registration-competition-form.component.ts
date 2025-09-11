import {Component, OnInit} from '@angular/core';
import {BaseComponent} from "@app/shared/components/base-component/base-component.component";
import {CommonUtils, ValidationService} from "@app/shared/services";
import {FormArray, FormGroup, Validators} from "@angular/forms";
import {ACTION_FORM} from "@app/core";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {AssessmentFormulaService} from "@app/core/services/assessment-formula/assessment-formula.service";
import {HelperService} from "@app/shared/services/helper.service";
import {CompetitionProgramService} from "@app/core/services/competition-program/competition-program.service";
import {formatDate} from "@angular/common";
import {FileControl} from "@app/core/models/file.control";
import {CompetitionResultService} from "@app/core/services/competition-result/competition-result.service";
import {UnitRegistrationService} from "@app/core/services/unit-registration/unit-registration.service";

@Component({
    selector: 'competition-unit-registration-add',
    templateUrl: './competition-unit-registration-competition-form.component.html',
    styleUrls: ['./competition-unit-registration-competition-form.component.css']
})
export class UnitRegistrationCompetitionFormComponent extends BaseComponent implements OnInit {

    formSave: FormGroup;
    view: boolean;
    update: boolean;
    typeView: any;
    reasonDenied: any;
    competitionRegistrationStatus: any;
    firstTitle: any;
    firstTitleNotRequired: any;
    lastTitleNotRequired: any;
    competitionId: any;
    lastTitle: any;
    lastTitleOther: any;
    competitionProgramCodeList: any;
    competitionProgramCode: any;
    competitionTitleList: any;
    rewardList: any;
    competitionRegistrationId: string = null;
    competitionCode: [''];
    competitionName: any;
    completionRate = '';
    detailDescription = '';
    resultEvaluation = '';
    status = '';
    reason = '';
    ortherEvaluation: any;
    objectId = '';
    type: any;
    resultList: any = [];
    formOtherConfig: FormArray;
    formConfig = {
        unit: [''],
        time: [''],
        competitionProgramCode: ['', ValidationService.required],
        competitionRegistrationId: [],
        competitionRegistrationCode: [],
        messageCompetition: [''],
        competitionRegistrationStatus: [''],
        competitionName: [''],
        startTime: [''],
        publisherUnitName: [''],
        rewardId: [''],
        titleId: [''],
        rewardName: [''],
        titleName: [''],
        type: [''],
        employeeCode: [''],
        unitName: [''],
        email: [''],
        fullName: [''],
        currentPosition: [''],
        reasonDenied: [''],
        phoneNumber: ['']
    }
    function1: any;

    constructor(
        private router: Router,
        public actr: ActivatedRoute,
        private activatedRoute: ActivatedRoute,
        public a: AssessmentFormulaService,
        private unitRegistrationService: UnitRegistrationService,
        public helperService: HelperService,
        public competitionResultService: CompetitionResultService
    ) {
        // Check quyền cho component
        super(null, CommonUtils.getPermissionCode("COMPETITION_UNIT_REGISTRATION"));
        const fileAttachment = new FileControl(null);
        this.buildForms({});
        this.buildFormOtherConfig();
        this.function1 = this.activatedRoute.snapshot.routeConfig.path.split('/')[0];
        this.competitionRegistrationId = this.activatedRoute.snapshot.paramMap.get('id');
        if (this.function1 == 'edit' || this.function1 == 'create') {
            this.update = true;
        } else if (this.function1 == 'view') {
            this.view = true;
        }

        if (this.competitionRegistrationId) {
            this.unitRegistrationService.getDetail({competitionRegistrationId: this.competitionRegistrationId}).subscribe(res => {
                this.formSave.get('competitionRegistrationId').setValue(res.data.competitionRegistrationId);
                this.formSave.get('competitionRegistrationCode').setValue(res.data.competitionRegistrationCode);
                this.formSave.get('competitionName').setValue(res.data.competitionName);
                this.formSave.get('competitionProgramCode').setValue(res.data.competitionProgramCode);
                this.formSave.get('unit').setValue(res.data.unitName);
                this.formSave.get('time').setValue(res.data.startTimeString.substring(6));
                this.formSave.get('messageCompetition').setValue(res.data.messageCompetition);
                this.formSave.get('startTime').setValue(res.data.startTimeString + " - " + res.data.endTimeString);
                this.formSave.get('publisherUnitName').setValue(res.data.publisherUnitName);
                this.formSave.get('rewardName').setValue(res.data.rewardCategoryName)
                this.formSave.get('titleName').setValue(res.data.titleName)
                this.formSave.get('titleId').setValue(Number(res.data.titleCode))
                this.formSave.get('rewardId').setValue(res.data.rewardCategoryId)
                this.formSave.get('type').setValue(res.data.type)
                this.formSave.get('competitionRegistrationStatus').setValue(res.data.competitionRegistrationStatus)
                this.typeView = res.data.type;
                this.competitionRegistrationStatus = res.data.competitionRegistrationStatus;
                this.competitionProgramCode = res.data.competitionProgramCode;
                this.objectId = res.data.objectId;
                if(res.data.competitionTargetRegistrationBOList.length === 0){
                    this.buildFormOtherConfig()
                }else{
                    this.buildFormOtherConfig(res.data.competitionTargetRegistrationBOList)
                }
                this.getListTitleCode(res.data.competitionProgramCode,res.data.objectId);
                this.getListReward(res.data.competitionProgramCode)
                if (res && res.data.fileAttachment) {
                    if (res.data.fileAttachment.attachFile) {
                        fileAttachment.setFileAttachment(res.data.fileAttachment.attachFile);
                    }
                }
                this.formSave.addControl('fileAttachment', fileAttachment);

                if (this.update) {
                    this.unitRegistrationService.getDetailCompetitionProgram({
                        competitionCode: this.competitionProgramCode,
                        type: "ORGANIZATION", typeForm: this.function1
                    }).subscribe(data => {
                        this.competitionProgramCodeList = data;
                    })
                }
            })
        }

        this.unitRegistrationService.getDetailEmployee().subscribe(res => {
            this.formSave.get('employeeCode').setValue(res.employeeCode)
            this.formSave.get('unitName').setValue(res.unitName)
            this.formSave.get('email').setValue(res.email)
            this.formSave.get('fullName').setValue(res.fullName)
            this.formSave.get('currentPosition').setValue(res.currentPosition)
            this.formSave.get('phoneNumber').setValue(res.phoneNumber)
        })

        if (this.view) {
            this.competitionResultService.findAllResultById({competitionRegistrationId: this.competitionRegistrationId}).subscribe(res => {
                this.resultList = res;
            });
        } else {
            return
        }

    }

    private buildFormOtherConfig(otherPartyList?: any): void {
        if (!otherPartyList) {
            this.formOtherConfig = new FormArray([this.createDefaultFormOtherConfig()]);
        } else {
            const controls = new FormArray([]);
            for (const item of otherPartyList) {
                const group = this.createDefaultFormOtherConfig();
                group.patchValue(item);
                controls.push(group);
            }
            this.formOtherConfig = controls;
        }
    }

    private createDefaultFormOtherConfig(): FormGroup {
        const group = {
            competitionTarget: [null, [ValidationService.required]],
            competitionSolution: [null, [ValidationService.required]],
        };
        return this.buildForm({}, group);
    }

    /**
     * addOtherItem
     * param index
     * param item
     */
    public addOtherItem(index: number) {
        const controls = this.formOtherConfig as FormArray;
        controls.insert(index + 1, this.createDefaultFormOtherConfig());
    }
    /**
     * removeOtherItem
     * param index
     * param item
     */
    public removeOtherItem(index: number) {
        const controls = this.formOtherConfig as FormArray;
        if (controls.length === 1) {
            return;
        }
        controls.removeAt(index);
    }

    ngOnInit() {
        if (this.view) {
            this.firstTitle = 'ui-g-12 ui-md-6 ui-lg-2 control-label vt-align-right';
            this.lastTitle = 'ui-g-12 ui-md-6 ui-lg-3 control-label vt-align-right';
            this.lastTitleOther = 'ui-g-12 ui-md-6 ui-lg-2 control-label vt-align-right';
            this.firstTitleNotRequired = 'ui-g-12 ui-md-6 ui-lg-2 control-label vt-align-right';
            this.lastTitleNotRequired = 'ui-g-12 ui-md-6 ui-lg-3 control-label vt-align-right ';
        } else {
            this.firstTitle = 'ui-g-12 ui-md-6 ui-lg-2 control-label vt-align-right required';
            this.lastTitle = 'ui-g-12 ui-md-6 ui-lg-3 control-label vt-align-right required';
            this.lastTitleOther = 'ui-g-12 ui-md-6 ui-lg-2 control-label vt-align-right required';
            this.firstTitleNotRequired = 'ui-g-12 ui-md-6 ui-lg-2 control-label vt-align-right';
            this.lastTitleNotRequired = 'ui-g-12 ui-md-6 ui-lg-3 control-label vt-align-right ';
        }

    }


    get f() {
        return this.formSave.controls;
    }

    public buildForms(data?: any) {
        this.formSave = this.buildForm(data, this.formConfig, ACTION_FORM.INSERT);
    }

    public goBack() {
        this.router.navigate(['/competition-unit-registration']);
    }

    processSaveOrUpdate() {
        if (this.rewardList && !this.formSave.get('rewardId').value) {
            this.formSave.get('rewardId').setErrors({required: true});
        } else if (this.competitionTitleList && !this.formSave.get('titleId').value) {
            this.formSave.get('titleId').setErrors({required: true});
        } else {
            this.formSave.get('rewardId').setErrors(null);
            this.formSave.get('titleId').setErrors(null);
        }

        if (!CommonUtils.isValidForm(this.formSave) || !CommonUtils.isValidForm(this.formOtherConfig)) {
            return;
        }
        var formData: any = new FormData();
        if (!CommonUtils.isNullOrEmpty(this.formSave.get('competitionRegistrationId').value)) {
            formData.append("competitionRegistrationId", this.formSave.get('competitionRegistrationId').value);
        }
        formData.append("competitionProgramCode", this.formSave.get('competitionProgramCode').value);
        formData.append("rewardCategoryId", this.formSave.get('rewardId').value);
        formData.append("titleCode", this.formSave.get('titleId').value);
        formData.append("competitionTarget","competitionTarget");
        formData.append("competitionSolution", "competitionSolution");
        formData.append("objectId", this.objectId)
        let count = 0;
        this.formOtherConfig.value.forEach(item => {
            formData.append("competitionTargetRegistrationBOList["+count+"].competitionTarget", item.competitionTarget);
            formData.append("competitionTargetRegistrationBOList["+count+"].competitionSolution", item.competitionSolution);
            count++
        })
        if (!CommonUtils.isNullOrEmpty(this.formSave.get('fileAttachment').value)) {
            this.formSave.get('fileAttachment').value.forEach(item => {
                formData.append("attachFiles", item);
            })
        }
        if (this.function1 == 'create' && this.competitionCode === this.formSave.get('competitionProgramCode').value) {
            this.unitRegistrationService.updateCompetitionRegistrationStatus({
                competitionCode: this.competitionCode.toString(),
                type: "UNIT_REGISTRATION"
            }).subscribe(res => {
            })
        }
        this.unitRegistrationService.saveRegistration(formData).subscribe(data => {
            this.helperService.reloadHeaderNotification('complete');
            this.router.navigate(['/competition-unit-registration']);
        });
    }

    processSaveOrUpdateAndActSign() {
        if (this.rewardList && !this.formSave.get('rewardId').value) {
            this.formSave.get('rewardId').setErrors({required: true});
        } else if (this.competitionTitleList && !this.formSave.get('titleId').value) {
            this.formSave.get('titleId').setErrors({required: true});
        } else {
            this.formSave.get('rewardId').setErrors(null);
            this.formSave.get('titleId').setErrors(null);
        }

        if (!CommonUtils.isValidForm(this.formSave) || !CommonUtils.isValidForm(this.formOtherConfig)) {
            return;
        }
        var formData: any = new FormData();
        if (!CommonUtils.isNullOrEmpty(this.formSave.get('competitionRegistrationId').value)) {
            formData.append("competitionRegistrationId", this.formSave.get('competitionRegistrationId').value);
        }
        formData.append("competitionProgramCode", this.formSave.get('competitionProgramCode').value);
        formData.append("rewardCategoryId", this.formSave.get('rewardId').value);
        formData.append("titleCode", this.formSave.get('titleId').value);
        formData.append("competitionTarget","competitionTarget");
        formData.append("competitionSolution", "competitionSolution");
        formData.append("objectId", this.objectId)
        let count = 0;
        this.formOtherConfig.value.forEach(item => {
            formData.append("competitionTargetRegistrationBOList["+count+"].competitionTarget", item.competitionTarget);
            formData.append("competitionTargetRegistrationBOList["+count+"].competitionSolution", item.competitionSolution);
            count++
        })
        if (!CommonUtils.isNullOrEmpty(this.formSave.get('fileAttachment').value)) {
            this.formSave.get('fileAttachment').value.forEach(item => {
                formData.append("attachFiles", item);
            })
        }
        if (this.function1 == 'create' && this.competitionCode === this.formSave.get('competitionProgramCode').value) {
            this.unitRegistrationService.updateCompetitionRegistrationStatus({
                competitionCode: this.competitionCode.toString(),
                type: "UNIT_REGISTRATION"
            }).subscribe(res => {
            })
        }
        this.unitRegistrationService.saveRegistration(formData).subscribe(data => {
            this.helperService.reloadHeaderNotification('complete');
            this.router.navigate(['/voffice-signing/competition-registration/', data.data.signDocumentId]);
        });
    }

    getListTitleCode(competitionCode: any, objectId: any) {
        if (CommonUtils.isNullOrEmpty(competitionCode) || CommonUtils.isNullOrEmpty(objectId)) {
            this.competitionTitleList = {};
            return;
        }
        this.unitRegistrationService.getTitleObjectId({'competitionProgramCode': competitionCode,'organizationId': objectId}).subscribe(res => {
            this.competitionTitleList = res;
        })
    }

    getListReward(param: any) {
        if (CommonUtils.isNullOrEmpty(param)) {
            this.rewardList = {};
            return;
        }
        this.unitRegistrationService.getListReward({'competitionCode': param}).subscribe(res => {
            this.rewardList = res;
        })
    }
}
