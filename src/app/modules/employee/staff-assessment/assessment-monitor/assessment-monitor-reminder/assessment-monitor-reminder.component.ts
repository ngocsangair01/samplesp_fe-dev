import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicApiService } from '@app/core';
import { AssessmentEmployeeLevelService } from '@app/core/services/assessment-employee-level/assessment-employee-level.service';
import { ReportManagerService } from '@app/core/services/report/report-manager.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/api';
import { isBuffer } from 'util';

@Component({
    templateUrl: './assessment-monitor-reminder.component.html',
})
export class AssessmentMonitorReminderComponent extends BaseComponent implements OnInit {

    form: FormGroup

    isMobileScreen: boolean = false;

    formConfig = {
        employee: [null, ValidationService.required],
        content: [null, ValidationService.required]
    }


    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private assessmentEmployeeLevelService: AssessmentEmployeeLevelService,
    ) {
        super();
        this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
     }

    ngOnInit() {
        this.form = this.buildForm('', this.formConfig);
    }

    sendSMS(){
        if (CommonUtils.isValidForm(this.form)){
            let param = {
                recipientId: this.form.value.employee,
                content: this.form.value.content
            }
            this.assessmentEmployeeLevelService.sendSMS(param).subscribe(res => {
                if(res.type == "SUCCESS") {
                    this.ref.close(true)
                }
            })
        }
    }
}
