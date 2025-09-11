import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, APP_CONSTANTS } from '@app/core/app-config';
import { FileControl } from '@app/core/models/file.control';
import { LetterDenunciationService } from '@app/core/services/monitoring/letter-denunciation.service';
import { CategoryService } from '@app/core/services/setting/category.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services/common-utils.service';
import { ValidationService } from '@app/shared/services/validation.service';
import { TranslationService } from 'angular-l10n';

@Component({
    selector: 'receive-letter-denunciation-form',
    templateUrl: './receive-letter-denunciation-form.component.html',
    styleUrls: ['./receive-letter-denunciation-form.component.css']
})
export class ReceiveLetterDenunciationFormComponent extends BaseComponent {

    types = APP_CONSTANTS.LETTER_DENUNCIATION_TYPE;
    formSave: FormGroup;
    letterDenunciationId: any;
    isView = false;
    isUpdate = false;
    isInsert = false;
    type = 1;
    categories = [];
    lableName = this.translation.translate('letterDenunciation.label.name');
    lableContent = this.translation.translate('letterDenunciation.label.content');
    settings = {
        singleSelection: false,
        text: "Chọn phân loại",
        selectAllText: this.translation.translate('common.label.choseAll'),
        unSelectAllText: 'Bỏ chọn tất cả',
        searchPlaceholderText: 'Nhập phân loại',
        enableSearchFilter: true,
        groupBy: 'categoryTypeName',
        labelKey: 'name',
        primaryKey: 'categoryId',
        noDataLabel: this.translation.translate('common.label.noData'),
        disabled: false
    };
    selectedItems = [];

    formConfig = {
        letterDenunciationId: [''],
        type: [1, [ValidationService.required]],
        categories: [[], ValidationService.required],
        code: [''],
        dateOfReception: ['', [ValidationService.required, ValidationService.beforeCurrentDate]],
        name: ['', [ValidationService.required, Validators.maxLength(200)]],
        content: ['', [ValidationService.required, Validators.maxLength(1500)]]
    };

    constructor(
        private letterDenunciationService: LetterDenunciationService,
        private categoryService: CategoryService,
        public translation: TranslationService,
        private router: Router,
        private app: AppComponent,
        private fb: FormBuilder) {
        super(null, CommonUtils.getPermissionCode('resource.receiveLetterDenunciation'));

        const subPaths = this.router.url.split('/');
        if (subPaths.length > 4) {
            this.letterDenunciationId = subPaths[5];
            this.isView = subPaths[4] === 'view';
            this.isUpdate = subPaths[4] === 'edit';
            this.isInsert = subPaths[4] === 'add';
            this.settings.disabled = this.isView;

            if (subPaths.length > 5) {
                if (CommonUtils.isValidId(subPaths[5])) {
                    this.setFormValue(subPaths[5]);
                }
            } else {
                this.setFormValue();
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

        const filesControl = new FileControl(null);

        if (data) {
            if (data.fileAttachment && data.fileAttachment.letterDenunciationFile) {
                filesControl.setFileAttachment(data.fileAttachment.letterDenunciationFile);
            }

            if (data.employeeIds) {
                this.formSave.setControl('employeeIds', this.fb.array(data.employeeIds));
            }

            if (data.partyOrganizationIds) {
                this.formSave.setControl('partyOrganizationIds', this.fb.array(data.partyOrganizationIds));
            }

            this.type = data.type;
        }

        this.formSave.addControl('files', filesControl);
        this.loadCategories();
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
        if (this.type == this.types[0].value || this.type == this.types[2].value) {
            this.f['employeeIds'].setValidators(ValidationService.required);
            this.f['partyOrganizationIds'].clearValidators();
        } else {
            this.f['partyOrganizationIds'].setValidators(ValidationService.required);
            this.f['employeeIds'].clearValidators();
        }
        this.f['employeeIds'].updateValueAndValidity();
        this.f['partyOrganizationIds'].updateValueAndValidity();

        if (!CommonUtils.isValidFormAndValidity(this.formSave)) {
            return;
        }

        this.app.confirmMessage(null, () => { // on accepted
            this.letterDenunciationService.saveOrUpdateFormFile(this.formSave.value)
                .subscribe(res => {
                    if (this.letterDenunciationService.requestIsSuccess(res) && res.data && res.data.letterDenunciationId) {
                        this.goView(res.data.letterDenunciationId);
                    }
                });
        }, () => {

        });
    }

    goBack() {
        this.router.navigate(['/monitoring-inspection/letter-denunciation/receive']);
    }

    goView(letterDenunciationId: any) {
        this.router.navigate([`/monitoring-inspection/letter-denunciation/receive/view/${letterDenunciationId}`]);
    }

    generateLetterDenunciationCode() {
        this.f['code'].setValue('');

        if (this.f['type'].value && this.f['dateOfReception'].value) {
            this.letterDenunciationService.generateLetterDenunciationCode(this.f['type'].value, new Date(this.f['dateOfReception'].value).getFullYear())
                .subscribe(res => {
                    this.f['code'].setValue(res);
                });
        }
    }

    onChangeType() {
        if (this.f['type'].value == 1 || this.f['type'].value == 2) {
            this.lableName = this.translation.translate('letterDenunciation.label.name');
            this.lableContent = this.translation.translate('letterDenunciation.label.content');
        } else if (this.f['type'].value == 3 || this.f['type'].value == 4) {
            this.lableName = this.translation.translate('letterDenunciation.label.name2');
            this.lableContent = this.translation.translate('letterDenunciation.label.content2');
        }
        if (this.type !== this.f['type'].value) {
            this.generateLetterDenunciationCode();
            this.loadCategories();
            this.type = this.f['type'].value;
        }
    }

    loadCategories() {
        const groupId = this.f['type'].value == this.types[0].value || this.f['type'].value == this.types[1].value ? APP_CONSTANTS.CATEGORY_TYPE_GROUP.KTGS_KN : APP_CONSTANTS.CATEGORY_TYPE_GROUP.KTGS_TC;
        this.categoryService.findByGroupId(groupId).subscribe(res => {
            this.categories = res.data;
        });
    }

    navigate() {
        this.router.navigate(['/monitoring-inspection/letter-denunciation/receive/edit/', this.letterDenunciationId]);
    }

}