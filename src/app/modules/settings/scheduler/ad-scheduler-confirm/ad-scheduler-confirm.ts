import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ReportManagerService } from '@app/core/services/report/report-manager.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { ValidationService } from '@app/shared/services';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/api';
import { RewardProposeService } from '@app/core/services/reward-propose/reward-propose.service';
import { Router } from '@angular/router';

@Component({
    templateUrl: './ad-scheduler-confirm.html',
})
export class AdSchedulerConfirmComponent extends BaseComponent implements OnInit {

    form: FormGroup

    formConfig = {
        confirmMes: [null]
    }


    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
    ) {
        super();
     }

    ngOnInit() {
        this.form = this.buildForm('', this.formConfig);
        if (this.config.data) {
            let value = {...this.config.data};
            this.form = this.buildForm(value, this.formConfig);
        }
    }
}
