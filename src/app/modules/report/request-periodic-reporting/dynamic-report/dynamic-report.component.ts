import {Component, ComponentFactoryResolver, OnInit, ViewChild} from "@angular/core";
import {BaseComponent} from "@app/shared/components/base-component/base-component.component";
import {FormGroup} from "@angular/forms";
import {AppComponent} from "@app/app.component";
import {ActivatedRoute, Router} from "@angular/router";
import {ACTION_FORM, REPORT_DYNAMIC_CONDITION_TYPE, RequestReportService} from "@app/core";
import {CommonUtils, ValidationService} from "@app/shared/services";
import {DomSanitizer} from "@angular/platform-browser";
import {
    ReportInputGenerateDirective
} from "@app/modules/report/request-periodic-reporting/dynamic-report/report-input-generate.directive";
import {ExportDynamicService} from "@app/modules/reports/report-dynamic/export-dynamic-service";
import {ReportDynamicService} from "@app/modules/reports/report-dynamic/report-dynamic.service";
import {
    InputOrgSelectorComponent
} from "@app/modules/report/request-periodic-reporting/dynamic-report/entry-components/input-org-selector.component";
import {
    InputPartyOrgSelectorComponent
} from "@app/modules/report/request-periodic-reporting/dynamic-report/entry-components/input-party-org-selector.component";
import {
    InputWomenOrgSelectorComponent
} from "@app/modules/report/request-periodic-reporting/dynamic-report/entry-components/input-women-org-selector.component";
import {
    InputYouthOrgSelectorComponent
} from "@app/modules/report/request-periodic-reporting/dynamic-report/entry-components/input-youth-org-selector.component";
import {
    InputUnionOrgSelectorComponent
} from "@app/modules/report/request-periodic-reporting/dynamic-report/entry-components/input-union-org-selector.component";
import {
    InputPositionSelectorComponent
} from "@app/modules/report/request-periodic-reporting/dynamic-report/entry-components/input-position-selector.component";
import {
    InputPartyPositionSelectorComponent
} from "@app/modules/report/request-periodic-reporting/dynamic-report/entry-components/input-party-position-selector.component";
import {
    InputMassPositionWomenSelectorComponent
} from "@app/modules/report/request-periodic-reporting/dynamic-report/entry-components/input-mass-position-women-selector.component";
import {
    InputMassPositionYouthSelectorComponent
} from "@app/modules/report/request-periodic-reporting/dynamic-report/entry-components/input-mass-position-youth-selector.component";
import {
    InputMassPositionUnionSelectorComponent
} from "@app/modules/report/request-periodic-reporting/dynamic-report/entry-components/input-mass-position-union-selector.component";
import {
    InputEmployeeSelectorComponent
} from "@app/modules/report/request-periodic-reporting/dynamic-report/entry-components/input-employee-selector.component";
import {
    InputEmployeeManagerSelectorComponent
} from "@app/modules/report/request-periodic-reporting/dynamic-report/entry-components/input-employee-manager-selector.component";
import {
    InputPartyMemberSelectorComponent
} from "@app/modules/report/request-periodic-reporting/dynamic-report/entry-components/input-party-member-selector.component";
import {
    InputMassMemberWomenSelectorComponent
} from "@app/modules/report/request-periodic-reporting/dynamic-report/entry-components/input-mass-member-women-selector.component";
import {
    InputMassMemberYouthSelectorComponent
} from "@app/modules/report/request-periodic-reporting/dynamic-report/entry-components/input-mass-member-youth-selector.component";
import {
    InputMassMemberUnionSelectorComponent
} from "@app/modules/report/request-periodic-reporting/dynamic-report/entry-components/input-mass-member-union-selector.component";
import {
    InputComboboxComponent
} from "@app/modules/report/request-periodic-reporting/dynamic-report/entry-components/input-combobox.component";
import {
    InputDatePickerComponent
} from "@app/modules/report/request-periodic-reporting/dynamic-report/entry-components/input-date-picker.component";
import {
    InputGenderComponent
} from "@app/modules/report/request-periodic-reporting/dynamic-report/entry-components/input-gender.component";
import {
    InputTextComponent
} from "@app/modules/report/request-periodic-reporting/dynamic-report/entry-components/input-text.component";
import {
    ReportInputGenerateComponent
} from "@app/modules/report/request-periodic-reporting/dynamic-report/report-input-generate.component";
import {RequestPeriodicReportingService} from "@app/core/services/report/request-periodic-reporting.service";
import {HelperService} from "@app/shared/services/helper.service";

@Component({
    selector: 'dynamic-report',
    templateUrl: './dynamic-report.component.html',
    styleUrls: ['./dynamic-report.component.css']
})
export class DynamicReportComponent extends BaseComponent implements OnInit{
    formSearch: FormGroup;
    periodOptions: any;
    reportDynamicOptions: any;
    deadLineOptions: any;
    selectedReport: any;
    urlPreview;
    fileName;
    isAllowSearch: any;
    isMobileScreen: boolean = false;
    @ViewChild(ReportInputGenerateDirective) inputGenerate: ReportInputGenerateDirective;
    formConfig = {
        title : [null],     // tên yêu cầu
        code: [null],       // mã biểu mẫu
        name: [null],       // tên biểu mẫu
        period: [null], // kỳ báo cáo
        deadLine: [null],   // thời hạn hoàn thành
        reportDynamicId: [null, ValidationService.required],      // loại báo cáo động
        businessType: [null],       // nghiệp vụ báo cáo
        requestId: [null],
    };

    constructor(
        private app: AppComponent,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private service: RequestPeriodicReportingService,
        private exportDynamicService: ExportDynamicService,
        public sanitizer: DomSanitizer,
        public reportDynamicService: ReportDynamicService,
        private componentFactoryResolver: ComponentFactoryResolver,
        private helperService: HelperService,
    ) {
        super();
        this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW);
        this.isAllowSearch = false;
        // lấy id từ route
        const requestReportingId = history.state.requestReportingId;
        // các trường dữ liệu disable
        this.service.findByRequestReportingIdDynamic(requestReportingId).subscribe(data => {
            if(data.data){
                Object.assign(data.data,{period: history.state.period,
                    deadLine: history.state.deadLine,
                    requestId: history.state.requestReportingId})
                this.formSearch = this.buildForm(data.data, this.formConfig, ACTION_FORM.VIEW);
                // danh sách báo cáo động
                this.reportDynamicService.getListExport().subscribe(res => {
                    this.helperService.isProcessing(true);
                    let listReportFilter = []
                    for (let i = 0; i < res.data.length; i++) {
                        let parent = res.data[i];
                        if (parent.items.length > 0) {
                            listReportFilter.push(parent.items)
                        } else {
                            res.data.splice(i, 1);
                            i--;
                        }
                    }
                    let dataDynamicReport = [];
                    for(let i in listReportFilter){
                        for(let j in listReportFilter[i]){
                            if(listReportFilter[i][j].code === data.data.code){
                                dataDynamicReport.push(Object.assign({}, listReportFilter[i][j]));
                            }
                        }
                    }
                    // list báo cáo động thỏa mãn
                    this.reportDynamicOptions = dataDynamicReport;
                    this.helperService.isProcessing(false);
                });
            }
        })
        this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
    }

    ngOnInit() {

    }

    get f() {
        return this.formSearch.controls;
    }

    back(){
        this.router.navigate(['/report/request-periodic-reporting']);
    }

    // xem báo cáo động
    previewReport(){
        if (!CommonUtils.isValidForm(this.formSearch)) {
            return
        }
        const reqData = this.formSearch.value;
        this.exportDynamicService.export(reqData)
            .subscribe(res => {
                this.urlPreview = this.exportDynamicService.serviceUrl + "/preview/" + res.filePath;
                this.fileName = res.fileName;
                this.urlPreview = this.sanitizer.bypassSecurityTrustResourceUrl(this.urlPreview);
            });
    }

    // tải file báo cáo động
    downloadFile(){
        if (!CommonUtils.isValidForm(this.formSearch)) {
            return
        }
        const reqData = this.formSearch.value;
        this.exportDynamicService.export(reqData)
            .subscribe(res => {
                window.location.href = this.exportDynamicService.serviceUrl + "/download/" + res.filePath + "/" + res.fileName;
            });
    }

    // sự kiên khi thay đổi loại báo cáo động
    changeReportDynamic(){
        let reportDynamicId = this.formSearch.value.reportDynamicId;
        this.urlPreview = null;
        this.inputGenerate.viewContainerRef.clear();
        if(reportDynamicId){
            this.reportDynamicService.findOne(reportDynamicId).subscribe(res => {
                this.selectedReport = res.data;
                if (this.selectedReport && this.selectedReport.formatReport === 'EXCEL_EXTENDS') {
                    this.isAllowSearch = true;
                }
                this.rebuildForm();
            });
        }
    }

    // build form các param cho báo cáo động
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

    // các component trong entry-components
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
        (<ReportInputGenerateComponent>componentRef.instance).control = control;
        (<ReportInputGenerateComponent>componentRef.instance).label = param.parameterName;
        if (selectData) {
            (<ReportInputGenerateComponent>componentRef.instance).selectData = selectData;
        }
    }
}
