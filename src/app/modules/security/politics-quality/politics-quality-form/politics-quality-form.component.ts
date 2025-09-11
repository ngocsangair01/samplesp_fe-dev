import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AppComponent } from '@app/app.component';
import { APP_CONSTANTS } from '@app/core';
import { PoliticsQualityService } from '@app/core/services/security-guard/politics-quality.service';
import { SysCatService } from '@app/core/services/sys-cat/sys-cat.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: 'politics-quality-form',
    templateUrl: './politics-quality-form.component.html',
    styleUrls: ['./politics-quality-form.component.css']
})
export class PoliticsQualityFormComponent extends BaseComponent {
    formSave: FormGroup;
    politicalClassList = [];
    politicalClassTooltip = "";
    formConfig = {
        politicsQualityId: [''],
        employeeId: [''],
        employeeCode: [''],
        fullName: [''],
        unitName: [''],
        politicalClass: [''],
        evaluationDate: [''],
        note: ['', [ValidationService.required, ValidationService.maxLength(1000)]]
    };

    constructor(
        private politicsQualityService: PoliticsQualityService,
        private sysCatService: SysCatService,
        private app: AppComponent,
        public activeModal: NgbActiveModal
    ) {
        super(null, CommonUtils.getPermissionCode("resource.politicsQuality"));
        this.sysCatService.findBySysCatTypeId(APP_CONSTANTS.SYS_CAT_TYPE_ID.POLITICAL_CLASS).subscribe(
            res => {
                this.politicalClassList = res.data;
                this.onPoliticalClassChange(this.f['politicalClass'].value);
            }
        );
        this.formSave = this.buildForm({}, this.formConfig);
    }

    get f() {
        return this.formSave.controls;
    }

    processSave() {
        if (!CommonUtils.isValidForm(this.formSave)) {
            return;
        }

        this.app.confirmMessage(null, () => { // on accepted
            this.politicsQualityService.saveOrUpdate(this.formSave.value)
                .subscribe(res => {
                    if (this.politicsQualityService.requestIsSuccess(res)) {
                        this.activeModal.close(res);
                    }
                });
        }, () => { });
    }

    public setFormValue(data?: any) {
        if (data && data.politicsQualityId > 0) {
            this.formSave = this.buildForm(data, this.formConfig);
        } else {
            this.formSave = this.buildForm({}, this.formConfig);
        }
    }

    onPoliticalClassChange(event) {
        const index = this.politicalClassList.findIndex(x => x.sysCatId === event);
        if (index > -1) {
            this.politicalClassTooltip = this.politicalClassList[index].description.replace(/(?:\\[rn]|[\r\n]+)+/g, "<br>");
        } else {
            this.politicalClassTooltip = "";
        }

        const note = this.f['note'].value;
        this.formSave.removeControl('note');
        if (!event || event == 17243) { // Không phân loại hoặc loại 3 thì bắt buộc phải nhập ghi chú
            this.formSave.addControl('note', new FormControl(note, [ValidationService.required, ValidationService.maxLength(1000)]));
        } else {
            this.formSave.addControl('note', new FormControl(note, [ValidationService.maxLength(1000)]));
        }
    }
}