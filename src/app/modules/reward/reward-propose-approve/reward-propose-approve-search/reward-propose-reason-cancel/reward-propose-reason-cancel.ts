import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicApiService, SELECTION_STATUS } from '@app/core';
import { ReportManagerService } from '@app/core/services/report/report-manager.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/api';
import { RewardProposeService } from '@app/core/services/reward-propose/reward-propose.service';

@Component({
    templateUrl: './reward-propose-reason-cancel.html',
})
export class popupReasonCancel extends BaseComponent implements OnInit {

    form: FormGroup

    formConfig = {
        reasonCancel: [null]
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
        const {rewardProposeId, signOrgId, proposeSynthetic, decisionSynthetic } = this.config.data
        if (CommonUtils.isValidForm(this.form)){
            this.rewardProposeService.updateStatus({ 
                rewardProposeId: rewardProposeId,
                status: SELECTION_STATUS.DA_XET_CHON, 
                signOrgId: signOrgId,
                proposeSynthetic: proposeSynthetic,
                decisionSynthetic: decisionSynthetic,
                reasonCancel: this.form.controls['reasonCancel'].value
            }).subscribe(res => {
                    this.ref.close(true)
            });
        }
    }

}
