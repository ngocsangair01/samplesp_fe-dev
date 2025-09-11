import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import {CommonUtils} from "@app/shared/services";

@Component({
    selector: 'competition-result-index',
    templateUrl: './competition-unit-registration-index.component.html'
})
export class UnitRegistrationIndexComponent extends BaseComponent implements OnInit {

    constructor() {
        super(null, CommonUtils.getPermissionCode("COMPETITION_UNIT_REGISTRATION"));
    }

    ngOnInit() {
    }

}
