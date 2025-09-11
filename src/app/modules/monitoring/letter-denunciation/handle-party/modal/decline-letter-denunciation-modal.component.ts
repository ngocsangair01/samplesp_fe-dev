import { Component, Input, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { AppComponent } from "@app/app.component";
import { ACTION_FORM, APP_CONSTANTS } from "@app/core";
import { FileControl } from "@app/core/models/file.control";
import { LetterDenunciationService } from "@app/core/services/monitoring/letter-denunciation.service";
import { BaseComponent } from "@app/shared/components/base-component/base-component.component";
import { CommonUtils, ValidationService } from "@app/shared/services";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: 'decline-letter-denunciation-modal',
    templateUrl: './decline-letter-denunciation-modal.component.html',
})
export class DeclineLetterDenunciationModalComponent extends BaseComponent implements OnInit {

    @Input() public letterDenunciationId;
    types = APP_CONSTANTS.LETTER_DENUNCIATION_TYPE;
    public formDecline: FormGroup;
    formConfig = {
        letterDenunciationId: [null],
        type: [null],
        code: [''],
        dateOfReception: [null],
        name: [''],
        lastProposalResult: ['', [ValidationService.required, ValidationService.maxLength(500)]],
    };

    constructor(
        public activeModal: NgbActiveModal,
        private service: LetterDenunciationService,
        private app: AppComponent,
        private fb: FormBuilder
    ) {
        super();

        this.buildForms();
    }

    ngOnInit() {
        if (this.letterDenunciationId && this.letterDenunciationId > 0) {
            this.service.findOne(this.letterDenunciationId).subscribe(res => {
                this.buildForms(res.data);
            });
        }
    }

    buildForms(data?: any): void {
        this.formDecline = this.buildForm(data ? data : {}, this.formConfig, ACTION_FORM.INSERT);
        this.f['employeeIds'] = new FormArray([]);
        this.f['partyOrganizationIds'] = new FormArray([]);

        const filesControl = new FileControl(null);

        if (data) {
            if (data.fileAttachment && data.fileAttachment.letterDenunciationFile) {
                filesControl.setFileAttachment(data.fileAttachment.letterDenunciationFile);
            }

            if (data.employeeIds) {
                this.formDecline.setControl('employeeIds', this.fb.array(data.employeeIds));
            }

            if (data.partyOrganizationIds) {
                this.formDecline.setControl('partyOrganizationIds', this.fb.array(data.partyOrganizationIds));
            }
        }

        this.formDecline.addControl('files', filesControl);
    }

    get f() {
        return this.formDecline.controls;
    }

    public actionSave() {
        if (!CommonUtils.isValidForm(this.formDecline)) {
            return;
        }
        this.app.confirmMessage("letterDenunciation.confirm.decline", () => { // on accepted
            this.formDecline.get('letterDenunciationId').setValue(this.letterDenunciationId);
            this.service.decline(this.formDecline.value)
                .subscribe(res => {
                    if (this.service.requestIsSuccess(res)) {
                        this.activeModal.close(res);
                    }
                });
        }, () => {
            // on rejected
        });
    }

}