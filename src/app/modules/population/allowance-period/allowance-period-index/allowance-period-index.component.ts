import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import {CommonUtils} from "@app/shared/services";

@Component({
    selector: 'allowance-period-index',
    templateUrl: './allowance-period-index.component.html'
})
export class AllowancePeriodIndexComponent extends BaseComponent implements OnInit {

    constructor() {
        super(null, CommonUtils.getPermissionCode("resource.allowancePeriod"));
    }

    ngOnInit() {
    }

}
