import { Component, OnInit } from '@angular/core';
import {FormGroup, Validators} from '@angular/forms';
import { ReportManagerService } from '@app/core/services/report/report-manager.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/api';
import {AllowanceProposalApprovalService} from "@app/core/services/population/allowance-proposal-approval.service";

@Component({
    templateUrl: './allowance-proposal-reason-cancel.html',
})
export class AllowanceProposalReasonCancel extends BaseComponent implements OnInit {

    form: FormGroup

    formConfig = {
        allowanceProposalId: [null],
        reasonCancel: [null, Validators.required]
    }


    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private service: ReportManagerService,
        private allowanceProposalApprovalService : AllowanceProposalApprovalService,
    ) {
        super();
     }

    ngOnInit() {
        this.form = this.buildForm('', this.formConfig);
    }

    updateStatus(){
        if (CommonUtils.isValidForm(this.form)){
            this.allowanceProposalApprovalService.saveOrUpdateReject({
                reasonCancel: this.form.controls['reasonCancel'].value,
                allowanceProposalId: this.config.data.allowanceProposalId
            }).subscribe(res => {
                    this.ref.close(true)
            });
        }
    }

}
