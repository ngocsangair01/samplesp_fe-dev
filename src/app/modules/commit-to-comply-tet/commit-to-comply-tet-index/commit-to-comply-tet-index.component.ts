import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import {CommonUtils} from "@app/shared/services";

@Component({
    selector: 'commit-to-comply-tet-index',
    templateUrl: './commit-to-comply-tet-index.component.html'
})
export class CommitToComplyTetIndexComponent extends BaseComponent implements OnInit {

    constructor() {
        super(null, CommonUtils.getPermissionCode("CTCT_BVAN_TET_COMMIT"));
    }

    ngOnInit() {
    }

}
