import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from '@app/app.component';
import { FileControl } from '@app/core/models/file.control';
import { AssessmentPartyOrganizationService } from '@app/core/services/assessment-party-organization/assessment-party-organization.service';
import { AssessmentPeriodService } from "@app/core/services/assessmentPeriod/assessment-period.service";
import {
    AssessmentEmployeeLevelService
} from "@app/core/services/assessment-employee-level/assessment-employee-level.service";
import { HrStorage } from '@app/core/services/HrStorage';
import { forEach } from '@angular/router/src/utils/collection';
import { HelperService } from '@app/shared/services/helper.service';
import { TranslationService } from 'angular-l10n';
// import _ from "lodash"

@Component({
    selector: 'assessment-member-sign',
    templateUrl: './assessment-member-sign.component.html',
    styleUrls: ['./assessment-member-sign.component.css']
})
export class AssessmentMemberSignComponent extends BaseComponent implements OnInit {
    formSign: FormGroup;
    public dataError: any;
    public assessmentList: any;
    public assessmentLevelList: any;
    currentEvent: any;
    assessmentEmployeeList: any = {};
    partyOrganizationId: any;
    isMobileScreen: boolean = false;
    formConfig = {
        partyOrganizationId: ['', ValidationService.required],
        assessmentPeriodId: [''],
        assessmentOrder: ['', ValidationService.required],
        signerId: ['']
    };

    constructor(
        public activeModal: NgbActiveModal,
        public assessmentPartyOrganizationService: AssessmentPartyOrganizationService,
        public assessmentEmployeeLevelService: AssessmentEmployeeLevelService,
        public app: AppComponent,
        private assessmentPeriodService: AssessmentPeriodService,
        private formBuilder: FormBuilder,
        private helperService: HelperService,
        public translation: TranslationService
    ) {
        super(null, 'ASSESSMENT_PERIOD');
        this.setMainService(assessmentPeriodService)
        this.buildForms({});
        this.buildFormsListAssessmentPeriodEmployee([]);
        this.assessmentPeriodService.getAssessmentPeriodList().subscribe(res => {
            this.assessmentList = res;
        });
        this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
    }

    ngOnInit() {
    }

    get f() {
        return this.formSign.controls;
    }

    public setFormValue(assessmentPeriodId, partyOrganizationId) {
        this.partyOrganizationId = partyOrganizationId;
        let data = {}
        if (partyOrganizationId != "") {
            data = {
                assessmentPeriodId: assessmentPeriodId,
                partyOrganizationId: partyOrganizationId
            }
        }
        else {
            data = {
                assessmentPeriodId: assessmentPeriodId
            }
        }
        this.buildForms(data)
        let paramSearch = { assessmentPeriodId: assessmentPeriodId }
        this.assessmentPeriodService.getAssessmentLevelList(paramSearch).subscribe(res => {
            this.assessmentLevelList = res;
        });

    }

    buildForms(data) {
        this.formSign = this.buildForm(data, this.formConfig);
    }

    public processSearchEmployee(event?) {
        if (!CommonUtils.isValidForm(this.formSign)) {
            return;
        }
        const params = this.formSign ? this.formSign.value : null
        if (!event) { // nếu mà bấm nút tìm kiếm trên form
            if (this.dataTable) {
                this.dataTable.first = 0
            }
        }
        this.currentEvent = params; //lưu lại điều kiện search cũ

        const searchData = CommonUtils.convertData(this.formSign.value)
        if (event) {
            searchData._search = event
        }
        const buildParams = CommonUtils.buildParams(searchData);
        this.assessmentPeriodService.getStaffMappingV2(buildParams).subscribe(res => {
            this.assessmentEmployeeList = res;
            this.assessmentEmployeeList = this.canYouHavePermission(res);
            this.checkFormSign(this.assessmentEmployeeList);
        })
    }

    private makeDefaultAssessmentSQLForm(): FormGroup {
        return this.formBuilder.group({
            employeeName: [null],
            employeeCode: [null],
            employeeEmail: [null],
            employeePositionName: [null],
            organizationName: [null],
            employeePartyPosition: [null],
            employeePartyOrganization: [null],
            levelNameEmployeeMapping: [null],
            evaluatingLevelName: [null],
            assessmentDeadlineDate: [null],
            assessmentResultStatus: [''],
            assessmentCompleteDate: [''],
        });
    }

    private buildFormsListAssessmentPeriodEmployee(data?: any[]) {
        if (data && data.length > 0) {
            data.forEach((item) => {
                if (item.assessmentOrder == 1 && !item.hasSign) {
                    item.hasSign = true;
                }
            })
        }
        const controls = new FormArray([]);
        for (const item of data) {
            const group = this.makeDefaultAssessmentSQLForm();
            group.patchValue(item);
            controls.push(group);
        }
        this.assessmentEmployeeList = controls;
    }

    /* @param res
    * @returns
    */
    private canYouHavePermission(res: any) {
        const data = res.data;
        if (!data || data.length <= 0) {
            return res;
        }
        const userLoginId = HrStorage.getUserToken().userInfo.employeeId;
        data.forEach(item => {
            const levelNameEmployeeList = item.levelNameEmployeeList || [];
            const assessmentOrder = this.findNextOrder(item.evaluatedLevel, levelNameEmployeeList);
            item.assessmentOrder2 = assessmentOrder;
            if (item.assessmentResultStatus == 0) {
                const founds = levelNameEmployeeList.filter(o => o.employeeId == userLoginId && o.assessmentOrder == assessmentOrder);
                item.canYouHavePermission = founds.length > 0;
            } else {
                item.canYouHavePermission = false;
            }
        })
        return res;
    }

    private findNextOrder(evaluatingLevel, levelNameEmployeeList) {
        const founds = levelNameEmployeeList.filter(o => o.assessmentOrder > evaluatingLevel);
        if (founds && founds.length > 0) {
            return founds[0].assessmentOrder;
        }
        return -1;
    }

    checkFormSign(assessmentEmployeeList){
        for(let i = 0; i < assessmentEmployeeList.data.length; i ++) {
            let data = assessmentEmployeeList.data[i];
            if (data.assessmentResultStatus != 4) {
                let message = this.translation.translate('WARNING.assessmentResult.requireList')
                this.helperService.APP_TOAST_MESSAGE.next({type: "WARNING", code: "assessmentResult.requireList" , message: data.employeePartyOrganization + message + data.evaluatingLevelName, data: null});
                return;
            }
        }
    }

    public openSign(assessmentEmployeeList) {
        this.checkFormSign(assessmentEmployeeList)
    }
}
