import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import {CommonUtils} from "@app/shared/services";

@Component({
    selector: 'emp-allowance-request-index',
    templateUrl: './emp-allowance-request-index.component.html'
})
export class EmpAllowanceRequestIndexComponent extends BaseComponent implements OnInit {

    constructor() {
        super(null, CommonUtils.getPermissionCode("resource.empAllowanceRequest"));
    }

    ngOnInit() {
    }

}
