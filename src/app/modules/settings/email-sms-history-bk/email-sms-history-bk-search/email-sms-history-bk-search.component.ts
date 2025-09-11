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
import {EmailSmsHistoryBkService} from "@app/core/services/setting/email-sms-history-bk.service";
import {HelperService} from "@app/shared/services/helper.service";

@Component({
    selector: 'email-sms-history-bk-search',
    templateUrl: './email-sms-history-bk-search.component.html',
    styleUrls: ['./email-sms-history-bk-search.component.css']
})
export class EmailSmsHistoryBkSearchComponent extends BaseComponent implements OnInit {
    formSearch: FormGroup;
    statusList: any;
    isHideSend : number;
    typeList: any;
    listChosenEmailSmsHistory = [];
    formConfig = {
        emailSmsHistoryId: [''],
        category: [''],
        type: [''],
        title: [''],
        content: [''],
        employeeId: [''],
        employeeName: [''],
        status: [''],
        employeeCode: [''],
        employeeEmail: [''],
        fromDate: [null],
        toDate: [null],
        listChosenEmailSmsHistory: [null],
        isCategory: [false],
        isType: [false],
        isEmployeeName: [false],
        isStatus: [false],
        isEmployeeCode: [false],
        isEmployeeEmail: [false],
        isFromDate: [false],
        isToDate: [false],
        isContent: [false]
    };


    constructor(
        private modalService: NgbModal,
        private emailSmsHistoryBkService: EmailSmsHistoryBkService,
        private router: Router,
        public dialogService: DialogService,
        private app: AppComponent
    ) {
        super();
        this.setMainService(emailSmsHistoryBkService);
        this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW);
        this.statusList = APP_CONSTANTS.STATUS_SEND
        this.typeList = APP_CONSTANTS.TYPE_SEND;
        this.processSearch();
    }

    ngOnInit() {

    }

    get f() {
        return this.formSearch.controls;
    }

    public prepareSaveOrUpdate(item?: any) {
        if (item && item.emailSmsHistoryId > 0) {
            this.router.navigate(['/settings/email-sms-history-edit/', item.emailSmsHistoryId]);
        } else {
            this.router.navigate(['/settings/email-sms-history-add']);
        }
    }

    /**
     * Xem chi tiet
     * @param item
     */
    public prepareView(item?: any) {
        if (item && item.emailSmsHistoryId > 0) {
            this.router.navigate(['/settings/email-sms-history-bk-view/', item.emailSmsHistoryId]);
        }
    }


    /**
     * hàm search add value isChoose cho item đã đuược chọn
     * @param event
     */
    processSearch(event?): void {
        if (!CommonUtils.isValidForm(this.formSearch)) {
            return;
        }
        if(this.formSearch.controls['status'].value === 0){
            this.isHideSend = 1;
        }
        else {
            this.isHideSend = 0;
        }
        const params = this.formSearch ? this.formSearch.value : null;
        this.emailSmsHistoryBkService.search(params, event).subscribe(res => {
            this.resultList = res;
            for (let i = 0; i < this.resultList.data.length; i++) {
                var index = this.listChosenEmailSmsHistory.indexOf(this.resultList.data[i].emailSmsHistoryId, 0)
                if (this.resultList.data[i].status == 0 && index != -1) {
                    this.resultList.data[i].isChoose = true
                }
            }
        });
        if (!event) {
            if (this.dataTable) {
                this.dataTable.first = 0;
            }
        }
    }
}
