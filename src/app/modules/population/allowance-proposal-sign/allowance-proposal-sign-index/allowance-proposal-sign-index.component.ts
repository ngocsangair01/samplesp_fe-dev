import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import {CommonUtils} from "@app/shared/services";

@Component({
    selector: 'allowance-proposal-sign-index',
    templateUrl: './allowance-proposal-sign-index.component.html'
})
export class AllowanceProposalSignIndexComponent extends BaseComponent implements OnInit {

    constructor() {
        super(null, CommonUtils.getPermissionCode("resource.allowanceProposalSign"));
    }

    ngOnInit() {
    }

}
