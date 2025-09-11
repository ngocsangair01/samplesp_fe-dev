import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, APP_CONSTANTS } from '@app/core/app-config';
import { FileControl } from '@app/core/models/file.control';
import { HandlingLetterDenunciationService } from '@app/core/services/monitoring/handling-letter-denunciation.service';
import { LetterDenunciationService } from '@app/core/services/monitoring/letter-denunciation.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services/common-utils.service';
import { ValidationService } from '@app/shared/services/validation.service';

@Component({
    selector: 'handle-party-letter-denunciation-form',
    templateUrl: './handle-party-letter-denunciation-form.component.html',
    styleUrls: ['./handle-party-letter-denunciation-form.component.css']
})
export class HandlePartyLetterDenunciationFormComponent extends BaseComponent {

    types = APP_CONSTANTS.LETTER_DENUNCIATION_TYPE;
    formSave: FormGroup;
    isView = false;
    isUpdate = false;
    isInsert = false;
    handlingLetterDenunciations = [];
    filesControl = new FileControl(null);
    employeeIds = [];
    partyOrganizationIds = [];
    isFinalResult = false;
    isExistedPartyOrganization = false;

    formConfig = {
        letterDenunciationId: [''],
        type: [null],
        code: [''],
        dateOfReception: [''],
        name: [''],
        handlingLetterDenunciationId: [null],
        recommendation: ['', [ValidationService.required, ValidationService.maxLength(500)]],
        settlementDate: [null, ValidationService.required],
        partyOrganizationId: [null, ValidationService.required],
        settlementResult: ['', [ValidationService.required, ValidationService.maxLength(500)]],
        isFinalResult: [false]
    };

    constructor(
        private service: HandlingLetterDenunciationService,
        private letterDenunciationService: LetterDenunciationService,
        private router: Router,
        private app: AppComponent,
        private fb: FormBuilder) {
        super(null, CommonUtils.getPermissionCode('resource.handlePartyLetterDenunciation'));

        const subPaths = this.router.url.split('/');

        if (subPaths.length > 5) {
            this.isView = subPaths[4] === 'view';
            this.isInsert = subPaths[4] === 'input';

            if (CommonUtils.isValidId(subPaths[5])) {
                this.setFormValue(subPaths[5]);
            }
        }
    }

    get f() {
        return this.formSave.controls;
    }

    buildForms(data?: any): void {
        this.formSave = this.buildForm(data ? data : {}, this.formConfig, ACTION_FORM.INSERT);
        this.f['employeeIds'] = new FormArray([]);
        this.f['partyOrganizationIds'] = new FormArray([]);

        if (data) {
            if (data.fileAttachment && data.fileAttachment.letterDenunciationFile) {
                this.filesControl.setFileAttachment(data.fileAttachment.letterDenunciationFile);
            }

            if (data.employeeIds) {
                this.employeeIds = data.employeeIds;
                this.formSave.setControl('employeeIds', this.fb.array(data.employeeIds));
            }

            if (data.partyOrganizationIds) {
                this.partyOrganizationIds = data.partyOrganizationIds;
                this.formSave.setControl('partyOrganizationIds', this.fb.array(data.partyOrganizationIds));
            }

            this.loadData();
        }

        this.formSave.addControl('files', this.filesControl);
    }

    setFormValue(letterDenunciationId?: any) {
        this.buildForms();

        if (letterDenunciationId && letterDenunciationId > 0) {
            this.letterDenunciationService.findOne(letterDenunciationId).subscribe(res => {
                this.buildForms(res.data);
            });
        }
    }

    processSaveOrUpdate() {
        if (!CommonUtils.isValidFormAndValidity(this.formSave)) {
            return;
        }

        if (this.isExistedPartyOrganization) {
            this.app.warningMessage('handleLetterDenunciation.label.existedPartyOrganization');
            return;
        }

        this.app.confirmMessage(null, () => { // on accepted
            this.service.saveOrUpdate(this.formSave.value)
                .subscribe(res => {
                    if (this.service.requestIsSuccess(res)) {
                        this.loadData();
                        this.refresh();
                    }
                });
        }, () => {

        });
    }

    goBack() {
        this.router.navigate(['/monitoring-inspection/letter-denunciation/handle-party']);
    }

    prepareUpdate(id) {
        if (id && id > 0) {
            this.isInsert = false;
            this.isUpdate = true;
            this.service.findOne(id).subscribe(res => {
                res.data.letterDenunciationId = this.f['letterDenunciationId'].value;
                res.data.type = this.f['type'].value;
                res.data.code = this.f['code'].value;
                res.data.dateOfReception = this.f['dateOfReception'].value;
                res.data.name = this.f['name'].value;
                this.formSave = this.buildForm(res.data, this.formConfig, ACTION_FORM.INSERT);
                this.formSave.setControl('employeeIds', this.fb.array(this.employeeIds));
                this.formSave.setControl('partyOrganizationIds', this.fb.array(this.partyOrganizationIds));
                this.formSave.addControl('files', this.filesControl);

                if (res.data.isFinalResult) {
                    this.isFinalResult = res.data.isFinalResult;
                } else {
                    this.checkFinalResult();
                }
            });
        }
    }

    checkFinalResult() {
        const temp = this.f['isFinalResult'].value;
        this.f['isFinalResult'].setValue(false);

        if (this.f['settlementDate'].value) {
            this.service.checkIsLastResult(this.f['letterDenunciationId'].value,
                CommonUtils.nvl(this.f['handlingLetterDenunciationId'].value),
                new Date(this.f['settlementDate'].value).getTime())
                .subscribe(res => {
                    this.isFinalResult = res === 'true';
                    if (this.isFinalResult) {
                        this.f['isFinalResult'].setValue(temp);
                    }
                });
        }
    }

    refresh() {
        this.isInsert = true;
        this.isUpdate = false;
        this.f['handlingLetterDenunciationId'].setValue(null);
        this.formSave.removeControl('recommendation');
        this.formSave.addControl('recommendation', new FormControl(null, Validators.required));
        this.formSave.removeControl('settlementDate');
        this.formSave.addControl('settlementDate', new FormControl(null, Validators.required));
        this.formSave.removeControl('partyOrganizationId');
        this.formSave.addControl('partyOrganizationId', new FormControl(null, Validators.required));
        this.formSave.removeControl('settlementResult');
        this.formSave.addControl('settlementResult', new FormControl(null, Validators.required));
        this.f['isFinalResult'].setValue(false);
    }

    delete(id) {
        if (id && id > 0) {
            this.app.confirmDelete(null, () => {// on accepted
                this.service.deleteById(id)
                    .subscribe(res => {
                        if (this.service.requestIsSuccess(res)) {
                            this.loadData();
                        }
                    });
            }, () => {// on rejected

            });
        }
    }

    loadData() {
        this.service.getByLetterDenunciationId(this.f['letterDenunciationId'].value).subscribe(res => {
            this.handlingLetterDenunciations = res;
        });
    }

    checkExistedPartyOrganization() {
        this.isExistedPartyOrganization = false;
        
        if (this.f['partyOrganizationId'].value) {
            if (this.f['handlingLetterDenunciationId'].value) {
                this.handlingLetterDenunciations.forEach(element => {
                    if (this.f['handlingLetterDenunciationId'].value !== element.handlingLetterDenunciationId &&
                        this.f['partyOrganizationId'].value === element.partyOrganizationId) {
                        this.app.warningMessage('handleLetterDenunciation.label.existedPartyOrganization');
                        this.isExistedPartyOrganization = true;
                    }
                });
            } else {
                this.handlingLetterDenunciations.forEach(element => {
                    if (this.f['partyOrganizationId'].value === element.partyOrganizationId) {
                        this.app.warningMessage('handleLetterDenunciation.label.existedPartyOrganization');
                        this.isExistedPartyOrganization = true;
                    }
                });
            }
        }
    }

}