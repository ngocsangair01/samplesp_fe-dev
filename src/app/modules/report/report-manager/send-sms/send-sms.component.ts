import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicApiService } from '@app/core';
import { ReportManagerService } from '@app/core/services/report/report-manager.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/api';

@Component({
    templateUrl: './send-sms.component.html',
})
export class SendSMSComponent extends BaseComponent implements OnInit {

    form: FormGroup

    formConfig = {
        employee: [null, ValidationService.required],
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
        if (empCode){
            this.dynamicApiService.getByCode("get-employee-by-code", {empCode: empCode})
            .subscribe(res => {
                if (res.length > 0){
                    this.form.controls.employee.setValue(res[0]);
                }
            })
        }

    }

    sendSMS(){
        if (CommonUtils.isValidForm(this.form)){
            let param = {
                employeeCode: this.form.value.employee.employeeCode,
                content: this.form.value.content
            }
            this.service.sendSMS(param)
            .subscribe(res => {})
        }
    }

}
