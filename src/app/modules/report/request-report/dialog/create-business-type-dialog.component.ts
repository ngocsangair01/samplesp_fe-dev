import { Component, OnInit } from '@angular/core';
import { BaseControl } from '@app/core/models/base.control';
import { DynamicDialogConfig } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/api';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { RequestReportService } from '@app/core';

@Component({
    templateUrl: './create-business-type-dialog.component.html',
})
export class CreateBusinessTypeComponent implements OnInit {

    activity: BaseControl;

    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private service: RequestReportService
    ) { }

    ngOnInit() {
        this.activity = new BaseControl();
        this.activity.setValidators(ValidationService.required);
    }

    save() {
        if (CommonUtils.isValidForm(this.activity)) {
            this.service.addActivityProgram(this.activity.value)
                .subscribe(res => {
                    if (res.type == "SUCCESS") {
                        this.ref.close(true);
                    }
                })
        }
    }
}
