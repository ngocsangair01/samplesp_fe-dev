import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { AssessmentPeriodService } from '@app/core/services/assessmentPeriod/assessment-period.service';
import { FormGroup, Validators, FormControl , FormArray, FormBuilder } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FileControl } from '@app/core/models/file.control';
import { CommonUtils, ValidationService } from '@app/shared/services';
import {APP_CONSTANTS} from '../../../../../core/app-config';
import { HelperService } from '@app/shared/services/helper.service';
@Component({
    selector: 'assessment-period-created-list',
    templateUrl: './assessment-period-created-list.component.html',
    styleUrls: ['./assessment-period-created-list.component.css']
})
export class AssessmentPeriodCreatedList extends BaseComponent implements OnInit {
    formData: FormGroup;
    dataError: any;
    formConfig = {
        assessmentPeriodId: [null , ValidationService.required],
        assessmentPeriodName: [''],
        assessmentPeriodObjectId: [null],
        employeeId: [null],
        partyOrganizationId: [null]
    };
    assessmentList: [];
    isMobileScreen: boolean = false;
    constructor(
        private router: Router,
        private app: AppComponent,
        private assessmentPeriodService: AssessmentPeriodService,
        public activeModal: NgbActiveModal,
        public helperService: HelperService,
    ) {
        super(null, 'ASSESSMENT_PERIOD');
        this.setMainService(assessmentPeriodService);
        this.buildForms({})
        this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
    }

    ngOnInit() {
    }

    private buildForms(data?: any) {
        this.formData = this.buildForm(data, this.formConfig);
    }
    get f () {
        return this.formData.controls;
    }
    /**
     * setFormValue
     * param data
     */
    public setFormValue(propertyConfigs: any, data: any) {
        this.propertyConfigs = propertyConfigs;
        this.assessmentList = data.assessmentList
        this.f['assessmentPeriodId'].setValue(data.assessmentPeriodId)
        this.f['employeeId'].setValue(data.employeeId)
        this.assessmentPeriodService.findOne(data.assessmentPeriodId).subscribe((res) => {
            const assessmentObject = APP_CONSTANTS.ASSESSMENT_OBJECT.find((item) => item.id == res.data.assessmentObject)
            this.f['assessmentPeriodName'].setValue(assessmentObject.name)
            this.f['assessmentPeriodObjectId'].setValue(assessmentObject.id)
        })
    }
    cancel(){
        this.activeModal.close();
    }
    public save() {
        if(!CommonUtils.isValidForm(this.formData)) {
            return;
        }
        this.app.confirmMessage('assessment.confirm.makeList',
            () => {
                const formData = {
                    assessmentPeriodId : this.formData.value.assessmentPeriodId ,
                    partyOrganizationId: this.formData.value.partyOrganizationId
                }
                this.assessmentPeriodService.makeList(formData).subscribe((res) => {
                    if(this.assessmentPeriodService.requestIsSuccess(res)) {
                        this.activeModal.close();
                    }
                })
            },
            () => { }
        )
    }
    public changeAssessmentPeriod(event) {
        this.assessmentPeriodService.findOne(event).subscribe((res) => {
            const assessmentObject = APP_CONSTANTS.ASSESSMENT_OBJECT.find((item) => item.id == res.data.assessmentObject)
            this.f['assessmentPeriodName'].setValue(assessmentObject.name)
            this.f['assessmentPeriodObjectId'].setValue(assessmentObject.id)
        })
    }
}
