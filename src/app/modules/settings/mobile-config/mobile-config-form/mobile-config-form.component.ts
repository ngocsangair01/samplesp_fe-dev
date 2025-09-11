import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { FileControl } from '@app/core/models/file.control';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { ValidationService } from '@app/shared/services/validation.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {MobileConfigService} from "@app/core/services/setting/mobile-config.service";

@Component({
    selector: 'mobile-config-form',
    templateUrl: './mobile-config-form.component.html',
    styleUrls: ['./mobile-config-form.component.css']
})
export class MobileConfigFormComponent extends BaseComponent implements OnInit {

    formSave: FormGroup;
    formConfig = {
        id: [''],
        isActive: [''],
        name: ['', [ValidationService.required, Validators.maxLength(200)]],
        code: ['', [ValidationService.required, Validators.maxLength(200)]],
        type: ['', [ValidationService.required]],
        configOrder: ['', [ValidationService.required]]
    };
    lstType = [
        {id: 1, name: "menu"},
        {id: 2, name: "banner"},
    ]
    constructor(
        public actr: ActivatedRoute,
        public activeModal: NgbActiveModal,
        private mobileConfigService: MobileConfigService,
        private app: AppComponent
    ) {
        super(null, 'CTCT_CONFIG_MOBILE');
        this.buildForms({});
    }

    ngOnInit() {
    }

    get f() {
        return this.formSave.controls;
    }

    /**
     * buildForm
     */
    private buildForms(data?: any): void {
        this.formSave = this.buildForm(data, this.formConfig);

        const fileAttachment = new FileControl(null, ValidationService.required);
        if (data && data.fileAttachment) {
            if (data.fileAttachment.file) {
                fileAttachment.setFileAttachment(data.fileAttachment.file);
            }
        }
        this.formSave.addControl('file', fileAttachment);
    }

    processSaveOrUpdate() {
        if (!CommonUtils.isValidForm(this.formSave)) {
            return;
        }

        this.app.confirmMessage(null, () => {// on accepted
            this.mobileConfigService.saveOrUpdateFormFile(this.formSave.value)
                .subscribe(res => {
                    if (this.mobileConfigService.requestIsSuccess(res)) {
                        this.activeModal.close(res);
                    }
                });
        }, () => {// on rejected
        });
    }
}
