// import {Component, OnInit} from '@angular/core';
// import {CommonUtils, ValidationService} from "@app/shared/services";
// import {BaseComponent} from "@app/shared/components/base-component/base-component.component";
// import {FormGroup} from "@angular/forms";
// import {ACTION_FORM} from "@app/core";

import {Component, OnInit} from "@angular/core";
import {BaseComponent} from "@app/shared/components/base-component/base-component.component";
import {FormGroup} from "@angular/forms";
import {CommonUtils, ValidationService} from "@app/shared/services";
import {ACTION_FORM} from "@app/core";
import {ActivatedRoute, Router} from "@angular/router";
import {CompetitionResultService} from "@app/core/services/competition-result/competition-result.service";
import {formatDate} from "@angular/common";
import {UnitRegistrationService} from "@app/core/services/unit-registration/unit-registration.service";

@Component({
    selector: 'competition-unit-registration-view',
    templateUrl: './competition-unit-registration-view.component.html',
    styleUrls: ['./competition-unit-registration-view.component.css']
})
export class UnitRegistrationViewComponent extends BaseComponent implements OnInit {

    firstTitle: any;
    lastTitle: any;

    competitionRegistrationId = '';
    competitionRegistrationCode = '';
    competitionProgramCode = '';
    competitionName = '';
    messageCompetition = '';
    unitCode = '';
    unitName = '';
    endTime = '';
    startTime = '';
    endTimeString = '';
    startTimeString = '';
    publisherUnitCode = '';
    competitionRegistrationStatus = '';
    titleCode = '';
    titleName = '';
    competitionTarget = '';
    competitionSolution = '';
    rewardCategoryName = '';
    view: boolean;
    update: boolean;
    labelTitle: any;
    formDetail = {};
    formSave: FormGroup;
    formConfig = {
        reason: [''],
        linkFile: [''],
        status: ['0'],
    };

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private competitionResultService: CompetitionResultService,
        private unitRegistrationService: UnitRegistrationService
    ) {
        // Check quyền cho component
        super(null, CommonUtils.getPermissionCode("COMPETITION_UNIT_REGISTRATION"));
        // const function1 = this.activatedRoute.snapshot.routeConfig.path.split('/')[0];
        // if (function1 == 'edit') {
        //     this.update = true;
        //     this.view = false;
        // } else if (function1 == 'view') {
        //     this.view = true;
        //     this.update = false;
        // }
        this.update = true;
        this.view = false;
        this.unitRegistrationService.findOne(Number(this.activatedRoute.snapshot.paramMap.get('id'))).subscribe(res => {
            this.competitionRegistrationId = res.data.competitionRegistrationId
            this.competitionRegistrationCode = res.data.competitionRegistrationCode
            this.competitionProgramCode = res.data.competitionProgramCode
            this.competitionName = res.data.competitionName
            this.unitCode = res.data.unitCode
            this.unitName = res.data.unitName
            this.messageCompetition = res.data.messageCompetition
            this.endTime = res.data.endTime
            this.startTime = res.data.startTime
            this.endTimeString = res.data.endTimeString
            this.startTimeString = res.data.startTimeString
            this.publisherUnitCode = res.data.publisherUnitCode
            this.competitionRegistrationStatus = res.data.competitionRegistrationStatus
            this.competitionTarget = res.data.competitionTarget
            this.competitionSolution = res.data.competitionSolution
            this.titleCode = res.data.titleCode
            this.titleName = res.data.titleName
            this.rewardCategoryName = res.data.rewardCategoryName
            Object.assign(this.formDetail, res.data)
            this.buildForms(res.data);
        })
    }

    public buildForms(data?: any) {
        this.formSave = this.buildForm(data, this.formConfig, ACTION_FORM.INSERT);
    }

    ngOnInit() {
        if (this.view) {
            this.labelTitle = 'info-approve-label';
        } else {
            this.labelTitle = 'info-approve-label label-required';
        }
    }

    get f() {
        return this.formSave.controls;
    }

    // public processSaveOrUpdate() {
    //     if (!CommonUtils.isValidForm(this.formSave)) {
    //         return;
    //     }
    //     Object.assign(this.formDetail, this.formSave.value)
    //     let data = this.formDetail
    //     // this.competitionResultService.saveCompetitionResult(data).subscribe(res=>{
    //     //     this.goBack()
    //     // })
    // }

    public goBack() {
        this.router.navigate(['/competition-unit-registration']);
    }
}
