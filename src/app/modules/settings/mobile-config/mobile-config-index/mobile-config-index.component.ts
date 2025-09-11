import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';

@Component({
    selector: 'mobile-config-index',
    templateUrl: './mobile-config-index.component.html'
})
export class MobileConfigIndexComponent extends BaseComponent implements OnInit {

    constructor() {
        super(null,'CTCT_CONFIG_MOBILE');
    }

    ngOnInit() {
    }

}
