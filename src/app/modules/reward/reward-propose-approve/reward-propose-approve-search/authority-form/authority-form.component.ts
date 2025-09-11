import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicApiService } from '@app/core';
import { ReportManagerService } from '@app/core/services/report/report-manager.service';
import { RewardProposeService } from '@app/core/services/reward-propose/reward-propose.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/api';

@Component({
    templateUrl: './authority-form.component.html',
})
export class AuthorityFormComponent extends BaseComponent implements OnInit {

    form: FormGroup
    data: any;

    formConfig = {
        authorityContent: [null, ValidationService.required, ValidationService.maxLength(2000)]
    }


    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        public rewardProposeService: RewardProposeService,
    ) {
        super();
     }

    ngOnInit() {
        this.form = this.buildForm('', this.formConfig);
    }

    authority(){
        if (CommonUtils.isValidForm(this.form)){
            let param = {
                authorityContent: this.form.value.authorityContent,
                rewardProposeId: this.config.data.rewardProposeId,
            }
            this.rewardProposeService.updateAuthority(param)
            .subscribe(res => {
                if (res.type == "SUCCESS") {
                    this.ref.close(true);
                }
            })
        }
    }

}
