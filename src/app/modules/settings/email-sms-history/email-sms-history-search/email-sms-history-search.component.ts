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
import {PoliticsQualityService} from "@app/core/services/security-guard/politics-quality.service";

@Component({
    selector: 'email-sms-history-search',
    templateUrl: './email-sms-history-search.component.html',
    styleUrls: ['./email-sms-history-search.component.css']
})
export class EmailSmsHistorySearchComponent extends BaseComponent implements OnInit {
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
    };


    constructor(
        private modalService: NgbModal,
        private emailSmsHistoryService: EmailSmsHistoryService,
        private router: Router,
        public dialogService: DialogService,
        private app: AppComponent,
        private politicsQualityService : PoliticsQualityService,
    ) {
        super(null, CommonUtils.getPermissionCode("resource.emailSmsHistory"));
        this.setMainService(emailSmsHistoryService);
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
            this.router.navigate(['/settings/email-sms-history-view/', item.emailSmsHistoryId]);
        }
    }

    processDelete(item) {
        if (item && item.emailSmsHistoryId > 0) {
            this.app.confirmDelete(null, () => {// on accepted
                this.emailSmsHistoryService.deleteById(item.emailSmsHistoryId)
                    .subscribe(res => {
                        if (this.emailSmsHistoryService.requestIsSuccess(res)) {
                            this.processSearch(null);
                        }
                    });
            }, () => {// on rejected

            });
        }
    }

    processCancel(item) {
        if (item && item.emailSmsHistoryId > 0) {
            this.emailSmsHistoryService.updateStatusCancel(item.emailSmsHistoryId).subscribe(res => {
                if (this.emailSmsHistoryService.requestIsSuccess(res)) {
                    this.processSearch(null);
                }
            });
        }
    }

    processCancelAll() {
        this.app.confirmMessage('history.email.confirm.cancel', () => { // on accepted
            const formData = this.formSearch.value;
            formData.listChosenEmailSmsHistory = this.listChosenEmailSmsHistory;
            this.emailSmsHistoryService.updateStatusCancelAllChoose(formData)
                .subscribe(res => {
                    if (this.emailSmsHistoryService.requestIsSuccess(res)) {
                        formData.listChosenEmailSmsHistory = null
                        this.processSearch(null);
                    }
                })
        }, () => {
            // on rejected
        });
    }

    processQuickCancel() {
        const category = this.formSearch.value.category;
        if (category == null || category == '') {
            this.app.warningMessage("formQuickCancel")
        } else {
            this.app.confirmMessage('history.email.confirm.quickCancel', () => { // on accepted
                const formData = this.formSearch.value;
                this.emailSmsHistoryService.updateStatusQuickCancel(formData)
                    .subscribe(res => {
                        if (this.emailSmsHistoryService.requestIsSuccess(res)) {
                            formData.listChosenEmailSmsHistory = null
                            this.processSearch(null);
                        }
                    })
            }, () => {
                // on rejected
            });
        }
    }

    processSend(){
        if(this.listChosenEmailSmsHistory.length >0){
            this.app.confirmMessage('history.email.confirm.send', () => {
                const formData = this.formSearch.value;
                this.emailSmsHistoryService.sendSmsEmail(this.listChosenEmailSmsHistory.toString())
                    .subscribe(res => {
                        formData.listChosenEmailSmsHistory = null
                        this.processSearch(null);
                    })
            }, () => {
                // on rejected
            });
            // on accepted
        }

    }

    processApproved() {
        const category = this.formSearch.value.category;
        if (category == null || category == '') {
            this.app.warningMessage("formApproved")
        } else {
            this.app.confirmMessage('history.email.confirm.approved', () => { // on accepted
                const formData = this.formSearch.value;
                this.emailSmsHistoryService.approved(formData)
                    .subscribe(res => {
                        if (this.emailSmsHistoryService.requestIsSuccess(res)) {
                            formData.listChosenEmailSmsHistory = null
                            this.processSearch(null);
                        }
                    })
            }, () => {
                // on rejected
            });
        }
    }

    /**
     * check item in resultList
     * @param event
     * @param item
     */
    onChoose(event, item: any) {
        const isChecked = event.target.checked;
        var index = this.listChosenEmailSmsHistory.indexOf(item.emailSmsHistoryId, 0)
        if (isChecked && index == -1) {
            this.listChosenEmailSmsHistory.push(item.emailSmsHistoryId)
            item.isChoose = true
        } else if (!isChecked && index != -1) {
            this.listChosenEmailSmsHistory.splice(index, 1)
            item.isChoose = false
        }
    }

    /**
     * check all item in resultList current
     * @param event
     * @param resultList
     */
    chooseAll(event, resultList: any) {
        const isChecked = event.target.checked;
        if (resultList.data.length > 0) {
            for (let i = 0; i < resultList.data.length; i++) {
                if (resultList.data[i].status == 0) {
                    var index = this.listChosenEmailSmsHistory.indexOf(resultList.data[i].emailSmsHistoryId, 0)
                    if (isChecked && index == -1) {
                        this.listChosenEmailSmsHistory.push(resultList.data[i].emailSmsHistoryId)
                        resultList.data[i].isChoose = true
                    } else if (!isChecked && index != -1) {
                        this.listChosenEmailSmsHistory.splice(index, 1)
                        resultList.data[i].isChoose = false
                    }
                }
            }
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
        this.emailSmsHistoryService.search(params, event).subscribe(res => {
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

    sendSmsEmailAll(event?): void {
        if (!CommonUtils.isValidForm(this.formSearch)) {
            return;
        }
        const params = this.formSearch ? this.formSearch.value : null;
        const formData = this.formSearch.value;
        this.emailSmsHistoryService.sendEmailSmsAll(params, event).subscribe(res => {
            formData.listChosenEmailSmsHistory = null
            this.processSearch(null);
            // this.resultList = res;
            // for(let i=0;i<this.resultList.data.length;i++){
            //   var index = this.listChosenEmailSmsHistory.indexOf(this.resultList.data[i].emailSmsHistoryId,0)
            //   if(this.resultList.data[i].status == 0 && index != -1){
            //     this.resultList.data[i].isChoose = true
            //   }
            // }
        });
    }

    test15(){
        this.politicsQualityService.test15().subscribe(res =>{
            console.log(res)
        })
    }
    test23(){
        this.politicsQualityService.test23().subscribe(res =>{
            console.log(res)
        })
    }
}
