import {Component, OnInit} from '@angular/core';
import {CommonUtils, ValidationService} from "@app/shared/services";
import {BaseComponent} from "@app/shared/components/base-component/base-component.component";
import {Router} from "@angular/router";
import {FormArray} from "@angular/forms";
import {AppComponent} from "@app/app.component";
import {ACTION_FORM} from "@app/core";
import {CompetitionProgramService} from "@app/core/services/competition-program/competition-program.service";
import {AppParamService} from "@app/core/services/app-param/app-param.service";
import {UnitRegistrationService} from "@app/core/services/unit-registration/unit-registration.service";

@Component({
    selector: 'competition-program-search',
    templateUrl: './competition-program-search.component.html',
    styleUrls: ['./competition-program-search.component.css']
})
export class CompetitionProgramSearchComponent extends BaseComponent implements OnInit {
    assessmentPeriodList = [];
    formConfig = {
        competitionTitle: [''],
        subjectType: [""],
        rewardCategory: [''],
        startTime: [""],
        endTime: [""],
        unitCode: [""],
        competitionType: [""],
        programType: [1],
        competitionName: [''],
        publisherUnitCode: [''],
        isCompetitionName: [false],
        isPublisherUnitCode: [false],
        isCompetitionTitle: [false],
        isSubjectType: [false],
        isRewardCategory: [false],
        isStartTime: [false],
        isEndTime: [false],
        isUnitCode: [false],
        isCompetitionType: [false],
    };

    competitionProgramCriteria: any;
    competitionProgramType: any;
    competitionProgramSubject: any;
    listApplicableUnit : any;

    constructor(private router: Router,
                private competitionProgramService: CompetitionProgramService,
                private appParamService: AppParamService,
                private unitRegistrationService: UnitRegistrationService,
                private app: AppComponent,
    ) {
        // Check quyền cho component
        super(null, CommonUtils.getPermissionCode("CTCT_COMPETITION_PROGRAM"));
        this.setMainService(competitionProgramService)
    }

    ngOnInit() {
        this.formSearch = this.buildForm({}, this.formConfig);

        // this.formSearch.controls['unitCode'] = new FormArray([]);

        // get loại đối tượng
        this.appParamService.appParams('OBJECT_TYPE').subscribe(res => {
            this.competitionProgramSubject = res.data
        })

        // get danh sách hình thức khen thưởng
        this.unitRegistrationService.geRewards().subscribe(res => {
            this.competitionProgramCriteria = res
        })

        // get loại chương trình thi đua
        this.appParamService.appParams('COMPETITION_TYPE').subscribe(res => {
            this.competitionProgramType = res.data
        })

        // get danh sách danh hiệu thi đua
        this.unitRegistrationService.getTitles().subscribe(res => {
            this.listApplicableUnit = res.data
        })

        this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW,
            [ValidationService.notAffter('startTime', 'endTime', 'transferEmployee.workProcess.etpExpiredDate')]);
        this.formSearch.controls['unitCode'] = new FormArray([]);
        this.preProcessSearch()
    }

    get f() {
        return this.formSearch.controls;
    }

    additional(){
        this.router.navigate(['/competition-program','create'])
    }

    edit(item) {
        this.router.navigate(['/competition-program','edit', item.competitionId])
    }

    viewDetail(item) {
        this.router.navigate(['/competition-program','view','competition-program', item.competitionId])
    }

    processDelete(item){
        this.app.confirmDelete(null, () => {// on accepted
            this.competitionProgramService.deleteById(item.competitionId).subscribe(res => {
                // chỉ load lại trang khi selete success
                if (res.code == 'warning') {

                } else {
                    this.preProcessSearch();
                }
            })
        }, () => {// on rejected

        });

    }

    preProcessSearch(event?: any) {
        this.formSearch.value['unitCode'] = this.formSearch.get('unitCode').value;
        this.processSearch(event);
    }
}
