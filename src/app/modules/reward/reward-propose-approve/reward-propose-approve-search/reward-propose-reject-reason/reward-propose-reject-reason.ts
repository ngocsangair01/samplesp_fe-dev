import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicApiService, SELECTION_STATUS } from '@app/core';
import { ReportManagerService } from '@app/core/services/report/report-manager.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/api';
import { RewardProposeService } from '@app/core/services/reward-propose/reward-propose.service';
import { Router } from '@angular/router';

@Component({
    templateUrl: './reward-propose-reject-reason.html',
})
export class popupRejectReason extends BaseComponent implements OnInit {

    form: FormGroup

    formConfig = {
        rejectReason: [null, [ValidationService.required, ValidationService.maxLength(255)]]
    }


    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private service: ReportManagerService,
        private rewardProposeService: RewardProposeService,
        private router: Router,
    ) {
        super();
     }

    ngOnInit() {
        this.form = this.buildForm('', this.formConfig);
    }

    updateStatus(){
        const {rewardProposeId, signOrgId, proposeSynthetic, decisionSynthetic } = this.config.data
        if (CommonUtils.isValidForm(this.form)){
            this.rewardProposeService.updateStatus({ 
                rewardProposeId: rewardProposeId,
                status: SELECTION_STATUS.BI_TU_CHOI, 
                signOrgId: signOrgId,
                proposeSynthetic: proposeSynthetic,
                decisionSynthetic: decisionSynthetic,
                rejectReason: this.form.controls['rejectReason'].value
            }).subscribe(res => {
                    this.ref.close(true)
                    this.router.navigate(['/reward/reward-propose-approval']);
            });
        }
    }
}
