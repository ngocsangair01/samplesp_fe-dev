import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicApiService, SELECTION_STATUS } from '@app/core';
import { ReportManagerService } from '@app/core/services/report/report-manager.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/api';
import { RewardProposeService } from '@app/core/services/reward-propose/reward-propose.service';
import * as moment from 'moment';

const DA_XET_DUYET = "DA_XET_DUYET"

@Component({
    templateUrl: './report-content-review.html',
})
export class reportContentReview extends BaseComponent implements OnInit {

    form: FormGroup

    formConfig = {
        decription: [null, ValidationService.maxLength(1000)]
    }


    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private service: ReportManagerService,
        private rewardProposeService: RewardProposeService,
    ) {
        super();
     }

    ngOnInit() {
        this.form = this.buildForm('', this.formConfig);
    }

    updateStatus(){
        if (CommonUtils.isValidForm(this.form)){
            let param = {
                    reportSubmissionId: this.config.data.reportSubmissionId,
                    status: DA_XET_DUYET,
                    decription: this.form.controls['decription'].value,
                    createdBy: this.config.data.createdBy
                    }
            this.service.updateStatusReport(param).subscribe(res => {
                if (res.type == "SUCCESS") {
                    this.ref.close(true);
                }
            })
        }
    }

}
