import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { DynamicApiService, RequestReportService } from '@app/core';
import { AppParamService } from '@app/core/services/app-param/app-param.service';
import { ReportManagerService } from '@app/core/services/report/report-manager.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/api';

@Component({
    templateUrl: './clone-popup-form.component.html',
})
export class ClonePopupFormComponent extends BaseComponent implements OnInit {

    form: FormGroup
    data: any;

    formConfig = {
        checkbox1: [null],
        checkbox2: [null]
    }


    constructor(
        public ref: DynamicDialogRef,
        public config: DynamicDialogConfig,
        private dynamicApiService: DynamicApiService,
        private service: RequestReportService,
        private router: Router,
        private app: AppComponent,
        private appParamService: AppParamService,
        private service2: ReportManagerService,
    ) {
        super();
     }

    ngOnInit() {
        this.form = this.buildForm('', this.formConfig);
    }

    navigateToClonePage() {
        this.ref.close(this.form.value);
      }
}
