import {Component, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {AppComponent} from '@app/app.component';
import {ACTION_FORM, APP_CONSTANTS} from '@app/core/app-config';
import {BaseComponent} from '@app/shared/components/base-component/base-component.component';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {EmailSmsHistoryService} from "@app/core/services/setting/email-sms-history.service";
import {
    PreviewEmailContentShowmoreComponent
} from "@app/modules/settings/email-sms-dynamic/preview-email-content-showmore/preview-email-content-showmore.component";
import {DialogService} from "primeng/api";
import {CommonUtils, ValidationService} from "@app/shared/services";
import {EmailSmsLogService} from "@app/core/services/setting/email-sms-log.service";

@Component({
    selector: 'email-sms-log-search',
    templateUrl: './email-sms-log-search.component.html',
    styleUrls: ['./email-sms-log-search.component.css']
})
export class EmailSmsLogSearchComponent extends BaseComponent implements OnInit {
    formSearch: FormGroup;
    typeList: any;
    formConfig = {
        category: [''],
        action: [''],
        employeeName: [''],
        employeeCode: [''],
        fromDate: [null],
        toDate: [null],
        isCategory: [false],
        isAction: [false],
        isEmployeeName: [false],
        isEmployeeCode: [false],
        isFromDate: [false],
        isToDate: [false],
    };


    constructor(
        private modalService: NgbModal,
        private emailSmsLogService: EmailSmsLogService,
        public dialogService: DialogService,
    ) {
        super();
        this.setMainService(emailSmsLogService);
        this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW);
        this.processSearch();
        this.typeList = APP_CONSTANTS.ACTION_LOG;
    }

    ngOnInit() {

    }

    get f() {
        return this.formSearch.controls;
    }
}
