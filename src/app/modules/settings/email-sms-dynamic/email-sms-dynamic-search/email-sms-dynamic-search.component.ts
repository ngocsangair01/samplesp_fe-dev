import { BaseComponent } from './../../../../shared/components/base-component/base-component.component';
import {Component, ComponentFactoryResolver, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {CommonUtils, ValidationService} from '@app/shared/services';
import {FileControl} from "@app/core/models/file.control";
import {ReportDynamicService} from "@app/modules/reports/report-dynamic/report-dynamic.service";
import {EmailSmsDynamicService} from "@app/core/services/setting/email-sms-dynamic.service";
import {ACTION_FORM, REPORT_DYNAMIC_CONDITION_TYPE} from "@app/core";
import {
    ReportInputGenerateDirective
} from "@app/modules/settings/email-sms-dynamic/email-sms-dynamic-export/report-input-generate.directive";
import {
    InputOrgSelectorComponent
} from "@app/modules/settings/email-sms-dynamic/email-sms-dynamic-export/entry-components/input-org-selector.component";
import {
    InputPartyOrgSelectorComponent
} from "@app/modules/settings/email-sms-dynamic/email-sms-dynamic-export/entry-components/input-party-org-selector.component";
import {
    InputWomenOrgSelectorComponent
} from "@app/modules/settings/email-sms-dynamic/email-sms-dynamic-export/entry-components/input-women-org-selector.component";
import {
    InputYouthOrgSelectorComponent
} from "@app/modules/settings/email-sms-dynamic/email-sms-dynamic-export/entry-components/input-youth-org-selector.component";
import {
    InputUnionOrgSelectorComponent
} from "@app/modules/settings/email-sms-dynamic/email-sms-dynamic-export/entry-components/input-union-org-selector.component";
import {
    InputPositionSelectorComponent
} from "@app/modules/settings/email-sms-dynamic/email-sms-dynamic-export/entry-components/input-position-selector.component";
import {
    InputPartyPositionSelectorComponent
} from "@app/modules/settings/email-sms-dynamic/email-sms-dynamic-export/entry-components/input-party-position-selector.component";
import {
    InputMassPositionWomenSelectorComponent
} from "@app/modules/settings/email-sms-dynamic/email-sms-dynamic-export/entry-components/input-mass-position-women-selector.component";
import {
    InputMassPositionYouthSelectorComponent
} from "@app/modules/settings/email-sms-dynamic/email-sms-dynamic-export/entry-components/input-mass-position-youth-selector.component";
import {
    InputMassPositionUnionSelectorComponent
} from "@app/modules/settings/email-sms-dynamic/email-sms-dynamic-export/entry-components/input-mass-position-union-selector.component";
import {
    InputEmployeeSelectorComponent
} from "@app/modules/settings/email-sms-dynamic/email-sms-dynamic-export/entry-components/input-employee-selector.component";
import {
    InputEmployeeManagerSelectorComponent
} from "@app/modules/settings/email-sms-dynamic/email-sms-dynamic-export/entry-components/input-employee-manager-selector.component";
import {
    InputPartyMemberSelectorComponent
} from "@app/modules/settings/email-sms-dynamic/email-sms-dynamic-export/entry-components/input-party-member-selector.component";
import {
    InputMassMemberWomenSelectorComponent
} from "@app/modules/settings/email-sms-dynamic/email-sms-dynamic-export/entry-components/input-mass-member-women-selector.component";
import {
    InputMassMemberYouthSelectorComponent
} from "@app/modules/settings/email-sms-dynamic/email-sms-dynamic-export/entry-components/input-mass-member-youth-selector.component";
import {
    InputMassMemberUnionSelectorComponent
} from "@app/modules/settings/email-sms-dynamic/email-sms-dynamic-export/entry-components/input-mass-member-union-selector.component";
import {
    InputComboboxComponent
} from "@app/modules/settings/email-sms-dynamic/email-sms-dynamic-export/entry-components/input-combobox.component";
import {
    InputDatePickerComponent
} from "@app/modules/settings/email-sms-dynamic/email-sms-dynamic-export/entry-components/input-date-picker.component";
import {
    InputGenderComponent
} from "@app/modules/settings/email-sms-dynamic/email-sms-dynamic-export/entry-components/input-gender.component";
import {
    InputTextComponent
} from "@app/modules/settings/email-sms-dynamic/email-sms-dynamic-export/entry-components/input-text.component";
import {
    ReportInputGenerateComponent
} from "@app/modules/settings/email-sms-dynamic/email-sms-dynamic-export/report-input-generate.component";
import {any} from "codelyzer/util/function";
import {DialogService} from "primeng/api";
import {
    PreviewEmailContentShowmoreComponent
} from "@app/modules/settings/email-sms-dynamic/preview-email-content-showmore/preview-email-content-showmore.component";
import {ReceiveNotificationGroupService} from "@app/core/services/setting/recieve-notification-group.service";
import {
    EmailSmsDynamicSearchPopupComponent
} from "@app/modules/settings/email-sms-dynamic/email-sms-dynamic-search/email-sms-dynamic-search-popup/email-sms-dynamic-search-popup.component";
import {FormGroup} from "@angular/forms";
@Component({
    selector: 'email-sms-dynamic-search',
    templateUrl: './email-sms-dynamic-search.component.html',
    styleUrls: ['./email-sms-dynamic-search.component.css']
})
export class EmailSmsDynamicSearchComponent extends BaseComponent implements OnInit {
    listNotificationType = [];
    listRecipients = [];
    listEmailSubject = [];
    listEmailContent = [];
    listBlackList = [];
    listSmsContent = [];
    firstTitle: any;
    lastTitle: any;
    selectedReport: any;
    isAllowSearch: any;
    isValidNotificationForm: any;
    isSelectEmail: any;
    isSelectSms: any;
    isNotSpam : boolean;
    formConfig: any = {
        notificationType: [null, [ValidationService.required]],
        contentSetting: [null, [ValidationService.required]],
        contentTextSetting: [0],
        notificationFormEmail: [false],
        notificationFormSms: [false],
        recipients: [null, [ValidationService.required]],
        emailSubject: [null],
        emailContent: [null],
        smsContent: [null],
        params: any,
        blackList: [null],
        category: [null],
        keyWord: [null],
        isContentSetting: [false],
        isCheckNotification: [false],
        isNotificationType: [false],
        isRecipients: [false],
        isEmailSubject: [false],
        isSmsContent: [false],
        isEmailContent: [false],
        isFileAttachments: [false],
        isBlackList: [false],
    };
    formSearchList: FormGroup;

    formSearchConfig = {
        keyword: [null]
    };

    @ViewChild(ReportInputGenerateDirective) inputGenerate: ReportInputGenerateDirective;

    constructor(
        public actr: ActivatedRoute,
        private modalService: NgbModal,
        private reportDynamicService: ReportDynamicService,
        private emailSmsDynamicService: EmailSmsDynamicService,
        private componentFactoryResolver: ComponentFactoryResolver,
        public dialogService: DialogService,
        private receiveNotificationGroupService: ReceiveNotificationGroupService,
    ) {
        super();
        this.formSearchList = this.buildForm({}, this.formSearchConfig);
        this.setMainService(emailSmsDynamicService);
        this.checkRequiredFirstTitle(false);
        this.checkRequiredLastTitle(false);
        this.formSearch = this.buildForm({}, this.formConfig);
        this.isNotSpam = false;
        this.receiveNotificationGroupService.getBlackList().subscribe(res => {
            this.listBlackList = res
        })
        const fileAttachments = new FileControl(null);
        this.formSearch.addControl('fileAttachments', fileAttachments);
        this.reportDynamicService.findSelectDataByCode().subscribe(
            res => this.listNotificationType = res
        );
    }

    ngOnInit() {
    }

    processSearchEvent(event?){
        this.changeValue()
        this.isValidNotificationForm = false;
        this.isSelectEmail = false;
        this.isSelectSms = false;
        // kiểm tra chọn hình thức tbao email không
        if(this.formSearch.get('notificationFormEmail').value === true){
            this.isSelectEmail = true;
            // tiêu đề email
            if(!this.formSearch.get('emailSubject').value){
                this.formSearch.controls['emailSubject'].setErrors({required: true})
            }else{
                this.formSearch.controls['emailSubject'].setErrors(null)
            }
            // nội dung email
            if(!this.formSearch.get('emailContent').value){
                this.formSearch.controls['emailContent'].setErrors({required: true})
            }else{
                this.formSearch.controls['emailContent'].setErrors(null)
            }
        }
        // kiểm tra chọn hình thức tbao sms không
        if(this.formSearch.get('notificationFormSms').value === true){
            this.isSelectSms = true;
            // nội dung sms
            if(!this.formSearch.get('smsContent').value){
                this.formSearch.controls['smsContent'].setErrors({required: true})
            }else{
                this.formSearch.controls['smsContent'].setErrors(null)
            }
        }
        const file = this.formSearch.get('fileAttachments').value;
        this.formSearch.get('fileAttachments').setValue(null)
        this.formSearch.get('params').setValue(null)
        this.formSearch.get('params').setValue(JSON.stringify(this.formSearch.value))
        this.formSearch.get('fileAttachments').setValue(file)
        // const reqData = this.formSearch.value;
        // this.processSearch(reqData)
        if (!CommonUtils.isValidForm(this.formSearch) || (!this.isSelectEmail && !this.isSelectSms )) {
            // điều kiện check email & sms hiển thị thông báo lỗi
            if(!this.isSelectEmail && !this.isSelectSms ){
                this.isValidNotificationForm = true;
            }
            return;
        }
        const params = this.formSearch ? this.formSearch.value : null;
        // close api check sql
        // const form = {
        //   notificationType: params['notificationType'],
        //   recipients: params['recipients'],
        //   emailSubject: params['emailSubject'],
        //   emailContent: params['emailContent'],
        //   smsContent: params['smsContent'],
        //   contentSetting: Number(params['contentSetting']),
        //   contentTextSetting: Number(params['contentTextSetting']),
        //   notificationFormEmail: Number(params['notificationFormEmail']),
        //   notificationFormSms: Number(params['notificationFormSms']),
        //   params: params['params'],
        //   blackList: params['blackList'],
        // }
        // this.emailSmsDynamicService.processCheckSQL(form).subscribe(res => {
        //   if(res === 1){
        this.emailSmsDynamicService.search(params, event).subscribe(res => {
            this.resultList = res;
            if(res.data.length === 0){
                const ref = this.dialogService.open(EmailSmsDynamicSearchPopupComponent, {
                    header: 'THÔNG BÁO LỖI',
                    width: '70%',
                    // height: '300px',
                    baseZIndex: 1000,
                    contentStyle: {"padding": "0"},
                    data: {
                        params: params
                    }
                });
                this.isNotSpam = false;
            }else{
                this.isNotSpam = true;
            }
        });
        //   }
        // });
        if (!event) {
            if (this.dataTable) {
                this.dataTable.first = 0;
            }
        }
    }

    // thêm require vào class cho first title
    checkRequiredFirstTitle(dataFirstTitle: boolean){
        this.firstTitle = 'ui-g-12 ui-md-6 ui-lg-2 control-label vt-align-right';
        if(dataFirstTitle){
            this.firstTitle = 'ui-g-12 ui-md-6 ui-lg-2 control-label vt-align-right required';
        }
    }
    // thêm require vào class cho last title
    checkRequiredLastTitle(dataLastTitle: boolean){
        this.lastTitle = 'ui-g-12 ui-md-6 ui-lg-3 control-label vt-align-right';
        if(dataLastTitle){
            this.lastTitle = 'ui-g-12 ui-md-6 ui-lg-3 control-label vt-align-right required';
        }
    }

    // sự kiện ẩn nút gửi
    changeValue(){
        this.isNotSpam = false
        this.isValidNotificationForm = false;
        if(this.resultList.data){
            this.resultList.data = []
        }
    }
    // thay đổi hình thức thông báo email
    onChangeEmail(event:any){
        this.changeValue()
        if (event.currentTarget.checked) {
            this.checkRequiredFirstTitle(true)
        }else{
            this.checkRequiredFirstTitle(false)
        }
    }

    // thay đổi hình thức thông báo sms
    onChangeSms(event:any){
        this.changeValue()
        if (event.currentTarget.checked) {
            this.checkRequiredLastTitle(true)
        }else{
            this.checkRequiredLastTitle(false)
        }
    }

    // ẩn nút gửi khi thay đổi select
    selectContent(event:any){
        this.changeValue()
    }

    selectNotificationType(event:any){
        this.changeValue()
        // build lại form để xóa bỏ các trường điều kiện theo báo cáo động cũ
        let data = {
            notificationType: this.formSearch.value.notificationType,
            contentSetting: this.formSearch.value.contentSetting,
            contentTextSetting: this.formSearch.value.contentTextSetting,
            notificationFormEmail: this.formSearch.value.notificationFormEmail,
            notificationFormSms: this.formSearch.value.notificationFormSms,
        }
        this.formSearch = this.buildForm(data, this.formConfig);
        const fileAttachments = new FileControl(null);
        this.formSearch.addControl('fileAttachments', fileAttachments);
        //
        if(event !== null){
            this.loadReportDynamicById(event)
            this.reportDynamicService.findSelectDataRepostSqlByReportDynamicId(event, 1).subscribe(
                res => this.listRecipients = res
            )
            this.reportDynamicService.findSelectDataRepostSqlByReportDynamicId(event, 2).subscribe(
                res => this.listEmailSubject = res
            )
            this.reportDynamicService.findSelectDataRepostSqlByReportDynamicId(event, 3).subscribe(
                res => this.listEmailContent = res
            )
            this.reportDynamicService.findSelectDataRepostSqlByReportDynamicId(event, 4).subscribe(
                res => this.listSmsContent = res
            )
        }
        else{
            this.inputGenerate.viewContainerRef.clear();
            this.listEmailContent = []
            this.listEmailSubject = []
            this.listSmsContent = []
            this.listRecipients = []
        }
    }

    public loadReportDynamicById(_reportDynamicId): void {
        // Clear old controls
        this.inputGenerate.viewContainerRef.clear();
        // delete all controls
        if (_reportDynamicId) {
            // load controls for current report
            this.reportDynamicService.findOne(_reportDynamicId).subscribe(res => {
                this.selectedReport = res.data;
                if (this.selectedReport && this.selectedReport.formatReport === 'EXCEL_EXTENDS') {
                    this.isAllowSearch = true;
                }
                this.rebuildForm();
            });
        }
    }

    public rebuildForm(): void {
        for (const param of this.selectedReport.lstReportParameter) {
            // set Validate for new control
            const validateFn = [];
            let selectData = [];
            if (param.isRequire) {
                validateFn.push(ValidationService.required);
            }
            if (param.dataType === REPORT_DYNAMIC_CONDITION_TYPE.DOUBLE) {
                validateFn.push(ValidationService.number);
            }
            if (param.dataType === REPORT_DYNAMIC_CONDITION_TYPE.LONG) {
                validateFn.push(ValidationService.integer);
            }
            // add controls
            this.formSearch.addControl(param.parameterCode,
                CommonUtils.createControl(ACTION_FORM.VIEW, param.parameterCode, null, validateFn, this.propertyConfigs));
            // load component
            if (param.dataType === REPORT_DYNAMIC_CONDITION_TYPE.COMBOBOX_CONDITION && param.description) {
                //   this.reportDynamicService.getSelectData(param.reportParameterId).subscribe(async resp => {
                //     selectData = resp.data;
                this.loadComponent(this.formSearch.controls[param.parameterCode], param, param.selectData);
                //   });
                continue;
            }
            if (param.dataType === REPORT_DYNAMIC_CONDITION_TYPE.COMBOBOX) {
                selectData = JSON.parse(param.description);
                this.loadComponent(this.formSearch.controls[param.parameterCode], param, selectData);
                continue;
            }
            this.loadComponent(this.formSearch.controls[param.parameterCode], param);
        }
    }

    public loadComponent(control: any, param: any, selectData?: any): void {
        let componentFactory: any;
        switch (param.dataType) {
            case REPORT_DYNAMIC_CONDITION_TYPE.ORGANIZATION_PERMISSION:
                componentFactory = this.componentFactoryResolver.resolveComponentFactory(InputOrgSelectorComponent);
                break;
            case REPORT_DYNAMIC_CONDITION_TYPE.PARTY_ORGANIZATION:
                componentFactory = this.componentFactoryResolver.resolveComponentFactory(InputPartyOrgSelectorComponent);
                break;
            case REPORT_DYNAMIC_CONDITION_TYPE.WOMEN_ORGANIATION:
                componentFactory = this.componentFactoryResolver.resolveComponentFactory(InputWomenOrgSelectorComponent);
                break;
            case REPORT_DYNAMIC_CONDITION_TYPE.YOUTH_ORGANIZATION:
                componentFactory = this.componentFactoryResolver.resolveComponentFactory(InputYouthOrgSelectorComponent);
                break;
            case REPORT_DYNAMIC_CONDITION_TYPE.UNION_ORGANIZATION:
                componentFactory = this.componentFactoryResolver.resolveComponentFactory(InputUnionOrgSelectorComponent);
                break;
            case REPORT_DYNAMIC_CONDITION_TYPE.POSITION:
                componentFactory = this.componentFactoryResolver.resolveComponentFactory(InputPositionSelectorComponent);
                break;
            case REPORT_DYNAMIC_CONDITION_TYPE.PARTY_POSITION:
                componentFactory = this.componentFactoryResolver.resolveComponentFactory(InputPartyPositionSelectorComponent);
                break;
            case REPORT_DYNAMIC_CONDITION_TYPE.MASS_POSITION_WOMEN:
                componentFactory = this.componentFactoryResolver.resolveComponentFactory(InputMassPositionWomenSelectorComponent);
                break;
            case REPORT_DYNAMIC_CONDITION_TYPE.MASS_POSITION_YOUTH:
                componentFactory = this.componentFactoryResolver.resolveComponentFactory(InputMassPositionYouthSelectorComponent);
                break;
            case REPORT_DYNAMIC_CONDITION_TYPE.MASS_POSITION_UNION:
                componentFactory = this.componentFactoryResolver.resolveComponentFactory(InputMassPositionUnionSelectorComponent);
                break;
            case REPORT_DYNAMIC_CONDITION_TYPE.EMPLOYEE:
                componentFactory = this.componentFactoryResolver.resolveComponentFactory(InputEmployeeSelectorComponent);
                break;
            case REPORT_DYNAMIC_CONDITION_TYPE.EMPLOYEE_MANAGER:
                componentFactory = this.componentFactoryResolver.resolveComponentFactory(InputEmployeeManagerSelectorComponent);
                break;
            case REPORT_DYNAMIC_CONDITION_TYPE.PARTY_MEMBER:
                componentFactory = this.componentFactoryResolver.resolveComponentFactory(InputPartyMemberSelectorComponent);
                break;
            case REPORT_DYNAMIC_CONDITION_TYPE.MASS_MEMBER_WOMEN:
                componentFactory = this.componentFactoryResolver.resolveComponentFactory(InputMassMemberWomenSelectorComponent);
                break;
            case REPORT_DYNAMIC_CONDITION_TYPE.MASS_MEMBER_YOUTH:
                componentFactory = this.componentFactoryResolver.resolveComponentFactory(InputMassMemberYouthSelectorComponent);
                break;
            case REPORT_DYNAMIC_CONDITION_TYPE.MASS_MEMBER_UNION:
                componentFactory = this.componentFactoryResolver.resolveComponentFactory(InputMassMemberUnionSelectorComponent);
                break;
            case REPORT_DYNAMIC_CONDITION_TYPE.COMBOBOX:
            case REPORT_DYNAMIC_CONDITION_TYPE.COMBOBOX_CONDITION:
                componentFactory = this.componentFactoryResolver.resolveComponentFactory(InputComboboxComponent);
                break;
            case REPORT_DYNAMIC_CONDITION_TYPE.DATE:
                componentFactory = this.componentFactoryResolver.resolveComponentFactory(InputDatePickerComponent);
                break;
            case REPORT_DYNAMIC_CONDITION_TYPE.GENDER:
                componentFactory = this.componentFactoryResolver.resolveComponentFactory(InputGenderComponent);
                break;
            default:
                componentFactory = this.componentFactoryResolver.resolveComponentFactory(InputTextComponent);
                break;
        }
        const viewContainerRef = this.inputGenerate.viewContainerRef;
        const componentRef = viewContainerRef.createComponent(componentFactory);
        // delete value khi chọn lại loại thông báo
        control.value = null;
        (<ReportInputGenerateComponent>componentRef.instance).control = control;
        (<ReportInputGenerateComponent>componentRef.instance).label = param.parameterName;
        if (selectData) {
            (<ReportInputGenerateComponent>componentRef.instance).selectData = selectData;
        }
    }

    sendNotification(){
        this.isValidNotificationForm = false;
        if(this.formSearch.get('notificationFormEmail').value === false &&this.formSearch.get('notificationFormSms').value === false) {
            this.isValidNotificationForm = true;
        }else{
            const file = this.formSearch.get('fileAttachments').value;
            this.formSearch.get('fileAttachments').setValue(null)
            this.formSearch.get('params').setValue(null)
            this.formSearch.get('params').setValue(JSON.stringify(this.formSearch.value))
            this.formSearch.get('fileAttachments').setValue(file)
            this.formSearch.get('category').setValue(this.listNotificationType.find(e => e.id == this.formSearch.get('notificationType').value).name)
            this.emailSmsDynamicService.sendNotification(this.formSearch.value).subscribe(res => {
            })
        }
    }

    get f () {
        return this.formSearch.controls;
    }

    public viewMore(data: string) {
        if(data){
            this.buildFormMoreAchievements(data);
        }else{
            this.buildFormMoreAchievements("Không có dữ liệu để hiển thị")
        }
    }

    public buildFormMoreAchievements(data: string){
        const ref = this.dialogService.open(PreviewEmailContentShowmoreComponent, {
            header: 'XEM CHI TIẾT NỘI DUNG EMAIL',
            width: '50%',
            // height: '300px',
            baseZIndex: 1000,
            contentStyle: {"padding": "0"},
            data: {
                emailContent: data
            }
        });
    }

    public filterFormSearch(){
        this.changeValue()
        let keyword = this.formSearchList.controls['keyword'].value;
        if(keyword){
            this.formSearch.get('keyWord').setValue(keyword)
        }else{
            this.formSearch.get('keyWord').setValue(null)
        }
        this.processSearchEvent()
    }

}
