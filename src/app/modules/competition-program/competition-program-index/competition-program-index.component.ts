import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import {CommonUtils} from "@app/shared/services";

@Component({
    selector: 'competition-program-index',
    templateUrl: './competition-program-index.component.html'
})
export class CompetitionProgramIndexComponent extends BaseComponent implements OnInit {

    constructor() {
        super(null, CommonUtils.getPermissionCode("CTCT_COMPETITION_PROGRAM"));
    }

    ngOnInit() {
    }

}
