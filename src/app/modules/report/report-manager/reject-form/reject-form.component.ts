import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicApiService } from '@app/core';
import { ReportManagerService } from '@app/core/services/report/report-manager.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/api';

const BI_TU_CHOI = "BI_TU_CHOI"
@Component({
    templateUrl: './reject-form.component.html',
})
export class RejectFormComponent extends BaseComponent implements OnInit {

    form: FormGroup
    data: any;

    formConfig = {
        content: [null, ValidationService.required]
    }


    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private dynamicApiService: DynamicApiService,
        private service: ReportManagerService,
    ) {
        super();
     }

    ngOnInit() {
        this.form = this.buildForm('', this.formConfig);
        let empCode = this.config.data.empSubmit ? this.config.data.empSubmit : this.config.data.createdBy;
    }

    reject(){
        if (CommonUtils.isValidForm(this.form)){
            let param = {
                title: this.form.value.content,
                // status: BI_TU_CHOI,
                reportSubmissionId:this.config.data.reportSubmissionId,
                createdBy: this.config.data.createdBy
            }
            this.service.reject(param)
            .subscribe(res => {
                if (res.type == "SUCCESS") {
                    this.ref.close(true);
                }
            })
        }
    }

}
