import { Component, OnInit } from '@angular/core';
import {FormGroup, Validators} from '@angular/forms';
import { AppComponent } from '@app/app.component';
import { FileControl } from '@app/core/models/file.control';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslationService } from 'angular-l10n';
import {UnitRegistrationService} from "@app/core/services/unit-registration/unit-registration.service";
import {CompetitionProgramService} from "@app/core/services/competition-program/competition-program.service";

@Component({
    selector: 'competition-unit-registration-import',
    templateUrl: './competition-unit-registration-import.component.html',
})
export class CompetitionUnitRegistrationImportComponent extends BaseComponent implements OnInit {

    public formImport: FormGroup;
    public dataError: any;
    competitionProgramOptions: any;
    private formImportConfig = {
        publisherUnitCode: [''],
        competitionProgramId: ['', [Validators.required]],
    };

    constructor(public translation: TranslationService,
                private app: AppComponent,
                public activeModal: NgbActiveModal,
                private unitRegistrationService: UnitRegistrationService,
                private competitionProgramService: CompetitionProgramService) {
        super(null, CommonUtils.getPermissionCode("COMPETITION_UNIT_REGISTRATION"));
        this.competitionProgramService.getListAllCompetitionRegistrationByUnit().subscribe(res => {
            this.competitionProgramOptions = res.data
        })
    }

    ngOnInit() {
    }

    get f() {
        return this.formImport.controls;
    }

    /**
     * buildForm
     */
    private buildForms(data?: any): void {
        this.formImport = this.buildForm(data, this.formImportConfig);
        this.formImport.addControl('fileImport', new FileControl(null, ValidationService.required));
    }

    /**
     * change value when select competition program
     */
    onChangeCompetitionProgram(){
        let data = {
            publisherUnitCode: '',
            competitionProgramId: '',
        }
        if(this.formImport.value.competitionProgramId){
            this.competitionProgramOptions.filter((item) => {
                if(item.competitionId === this.formImport.value.competitionProgramId){
                    data = {
                        publisherUnitCode: item.publisherUnitCode,
                        competitionProgramId: item.competitionId,
                    }
                }
            })
        }
        this.buildForms(data)
    }

    /**
     * setFormValue
     * param data
     */
    public setFormValue(propertyConfigs: any, data?: any) {
        this.buildForms(data);
    }

    /**
     * Download file biểu mẫu
     */
    public processDownloadTemplate() {
        // if(this.formImport.value.competitionProgramId === ''){
        //     this.app.warningMessage('message.warning.invalidCompetitionProgram','',10000);
        // }else{
            const params = this.formImport.value;
            this.unitRegistrationService.downloadTemplateImport(params).subscribe(res => {
                saveAs(res, 'Biểu mẫu import đăng ký thi đua tập thể.xls');
            });
        // }
    }

    /**
     * Thực hiện import
     */
    processImport() {
        this.formImport.controls['fileImport'].updateValueAndValidity();
        if (!CommonUtils.isValidForm(this.formImport)) {
            return;
        }
        this.app.confirmMessage(null, () => {// on accepted
            this.unitRegistrationService.processImport(this.formImport.value).subscribe(res => {
                if (res.type !== 'SUCCESS') {
                    this.dataError = res.data;
                } else {
                    this.dataError = null;
                    this.activeModal.close(res);
                }
            });
        }, () => {
            // on rejected
        });
    }
}
