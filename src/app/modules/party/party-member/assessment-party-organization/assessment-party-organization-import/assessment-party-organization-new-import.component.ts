import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from '@app/app.component';
import { FileControl } from '@app/core/models/file.control';
import { AssessmentPartyOrganizationService } from '@app/core/services/assessment-party-organization/assessment-party-organization.service';
import {AssessmentPeriodService} from "@app/core/services/assessmentPeriod/assessment-period.service";
import {
    AssessmentEmployeeLevelService
} from "@app/core/services/assessment-employee-level/assessment-employee-level.service";
// import _ from "lodash"

@Component({
    selector: 'assessment-party-organization-new-import',
    templateUrl: './assessment-party-organization-new-import.component.html',
    styleUrls: ['./assessment-party-organization-new-import.component.css']
})
export class AssessmentPartyOrganizationNewImportComponent extends BaseComponent implements OnInit {
    formImport: FormGroup;
    // assessmentPartyOrganizationId: number;
    public dataError: any;
    public assessmentList: any;
    public assessmentLevelList: any;
    isMobileScreen: boolean = false;
    formConfig = {
        partyOrganizationId: ['', ValidationService.required ],
        assessmentPeriodId: [''],
        assessmentOrder: ['', ValidationService.required]
    };
    formExport = {
        partyOrganizationId: ['', ValidationService.required ],
        assessmentPeriodId: [''],
        assessmentOrder: ['', ValidationService.required]
    };

    constructor(
        public activeModal: NgbActiveModal,
        public assessmentPartyOrganizationService: AssessmentPartyOrganizationService,
        public assessmentEmployeeLevelService: AssessmentEmployeeLevelService,
        public app: AppComponent,
        private assessmentPeriodService: AssessmentPeriodService,
    ) {
        super(null, CommonUtils.getPermissionCode("resource.assessmentPartyOrganization"));
        this.setMainService(assessmentPartyOrganizationService)
        this.buildForms({});
        this.assessmentPeriodService.getAssessmentPeriodList().subscribe(res => {
            this.assessmentList = res;
        });
        this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
    }

    ngOnInit() {
    }

    get f() {
        return this.formImport.controls;
    }

    public setFormValue(assessmentPeriodId, partyOrganizationId) {
        let data = {}
        if(partyOrganizationId != ""){
            data={
                assessmentPeriodId: assessmentPeriodId,
                partyOrganizationId: partyOrganizationId
            }
        }
        else {
            data={
                assessmentPeriodId: assessmentPeriodId
            }
        }
        this.buildForms(data)
        let paramSearch = { assessmentPeriodId: assessmentPeriodId}
        this.assessmentPeriodService.getAssessmentLevelList(paramSearch).subscribe(res=>{
            this.assessmentLevelList = res.filter(item => item.assessmentOrder > 1); // không lấy cấp cá nhân đánh giá
        });

    }

    processDownloadTemplate() {
        if(this.formImport.value.partyOrganizationId == '' || this.formImport.value.assessmentOrder == ''){
            this.app.warningMessage('assessmentPeriodImportVotingIsEmpty');
            return;
        }
        this.assessmentEmployeeLevelService.downloadTemplateImport(this.formImport.value).subscribe(res => {
            saveAs(res, 'assessment_party_organization_template.xlsx');
        });
    }

    processImport() {
        if (!CommonUtils.isValidForm(this.formImport)) {
            return;
        }
        this.app.confirmMessage(null, () => {// on accepted
            this.assessmentEmployeeLevelService.processImport(this.formImport.value).subscribe(res => {
                if (res.type === 'WARNING') {
                    this.dataError = res.data;
                } else if (res.type === 'ERROR') {
                    this.dataError = null;
                } else if (res.type === 'SUCCESS') {
                    this.dataError = null;
                    this.activeModal.close(res);
                }
            });
        }, () => {
            // on rejected
        });
    }

    buildForms(data) {
        this.formImport = this.buildForm(data, this.formConfig);
        this.formImport.addControl('fileImport', new FileControl(null, ValidationService.required));
    }

    cancel() {
        this.activeModal.close();
    }

}
