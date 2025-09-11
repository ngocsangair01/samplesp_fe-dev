import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import {CommonUtils} from "@app/shared/services";

@Component({
    selector: 'allowance-proposal-index',
    templateUrl: './allowance-proposal-index.component.html'
})
export class AllowanceProposalIndexComponent extends BaseComponent implements OnInit {

    constructor() {
        super(null, CommonUtils.getPermissionCode("resource.allowanceProposal"));
    }

    ngOnInit() {
    }

}
