import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { AssessmentPeriodService } from '@app/core/services/assessmentPeriod/assessment-period.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FileControl } from '@app/core/models/file.control';
import { CommonUtils, ValidationService } from '@app/shared/services';

@Component({
    selector: 'assessment-period-new-import',
    templateUrl: './assessment-period-new-import.component.html',
    styleUrls: ['./assessment-period-new-import.component.css']
})
export class AssessmentPeriodNewImportComponent extends BaseComponent implements OnInit {
    formImport: FormGroup;
    dataError: any;
    assessmentList: any;
    isMobileScreen: boolean = false;
    formConfig = {
        assessmentPeriodId: ['', [ValidationService.required]],
        assessmentPeriodName: [''],
        partyOrganizationId: ['',[ValidationService.required]]
    };
    constructor(
        private router: Router,
        private app: AppComponent,
        private assessmentPeriodService: AssessmentPeriodService,
        public activeModal: NgbActiveModal,
    ) {

        super(null, 'ASSESSMENT_PERIOD');
        this.setMainService(assessmentPeriodService);
        this.formImport = this.buildForm({}, this.formConfig);
        this.formImport.addControl('fileImport', new FileControl(null, [Validators.required]));
        this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
    }

    ngOnInit() {
        this.formImport.controls['partyOrganizationId'].setValue(1);
        this.assessmentPeriodService.getAssessmentPeriodListByIsLock().subscribe(res => {
            this.assessmentList = res;
        });
    }

    private buildForms(data?: any) {
        this.formImport = this.buildForm(data, this.formConfig);
        this.formImport.addControl('fileImport', new FileControl(null, [Validators.required]));
    }

    get f () {
        return this.formImport.controls;
    }

    processDownloadTemplate() {
        const params = this.formImport.value;
        delete params['fileImport'];
        this.formImport.removeControl('fileImport');
        this.formImport.addControl('fileImport', new FormControl(null));
        this.assessmentPeriodService.downloadTemplateImportNew(params).subscribe(
            res => {
                saveAs(res, 'assessment_period_new_import.xls');
            }
        );
        this.formImport.controls['fileImport'].setValidators(ValidationService.required);
    }
    /**
     * setFormValue
     * param data
     */
    public setFormValue(propertyConfigs: any, data: any) {
        this.propertyConfigs = propertyConfigs;
        this.buildForms(data);
    }
    cancel(){
        this.activeModal.close();
    }
    processImport() {
        this.formImport.controls['fileImport'].updateValueAndValidity();
        this.formImport.controls['partyOrganizationId'].updateValueAndValidity();
        if (!CommonUtils.isValidForm(this.formImport)) {
            return;
        }
        this.app.confirmMessage(null, () => {// on accepted
            this.assessmentPeriodService.processImportNew(this.formImport.value).subscribe(
                res => {
                    if (this.assessmentPeriodService.requestIsSuccess(res)) {
                        this.activeModal.close();
                        this.router.navigate(['/employee/assessment/manager-field/assessment-period/member']);
                    } else {
                        this.dataError = res.data;
                    }
                }
            );
        }, () => {// on reject
        });
    }

}
