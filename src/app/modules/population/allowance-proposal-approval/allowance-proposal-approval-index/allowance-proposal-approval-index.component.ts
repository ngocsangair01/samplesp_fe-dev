import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import {CommonUtils} from "@app/shared/services";

@Component({
    selector: 'allowance-proposal-approval-index',
    templateUrl: './allowance-proposal-approval-index.component.html'
})
export class AllowanceProposalApprovalIndexComponent extends BaseComponent implements OnInit {

    constructor() {
        super(null, CommonUtils.getPermissionCode("resource.allowanceProposalApproval"));
    }

    ngOnInit() {
    }

}
