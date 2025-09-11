import { Component, ComponentFactoryResolver, OnInit, Pipe, PipeTransform, ViewChild } from '@angular/core';
import { async } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import {ACTION_FORM, APP_CONSTANTS, LARGE_MODAL_OPTIONS, REPORT_DYNAMIC_CONDITION_TYPE, UserMenu} from '@app/core';
import { HrStorage } from '@app/core/services/HrStorage';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
;
import { environment } from '@env/environment';
import {ReportDynamicService} from "@app/modules/reports/report-dynamic/report-dynamic.service";
import {ExportDynamicService} from "@app/modules/reports/report-dynamic/export-dynamic-service";
import {
    InputOrgSelectorComponent
} from "@app/modules/reports/report-dynamic/report-dynamic-export/entry-components/input-org-selector.component";
import {
    InputPartyOrgSelectorComponent
} from "@app/modules/reports/report-dynamic/report-dynamic-export/entry-components/input-party-org-selector.component";
import {
    InputWomenOrgSelectorComponent
} from "@app/modules/reports/report-dynamic/report-dynamic-export/entry-components/input-women-org-selector.component";
import {
    InputYouthOrgSelectorComponent
} from "@app/modules/reports/report-dynamic/report-dynamic-export/entry-components/input-youth-org-selector.component";
import {
    InputUnionOrgSelectorComponent
} from "@app/modules/reports/report-dynamic/report-dynamic-export/entry-components/input-union-org-selector.component";
import {
    InputPositionSelectorComponent
} from "@app/modules/reports/report-dynamic/report-dynamic-export/entry-components/input-position-selector.component";
import {
    InputPartyPositionSelectorComponent
} from "@app/modules/reports/report-dynamic/report-dynamic-export/entry-components/input-party-position-selector.component";
import {
    InputMassPositionWomenSelectorComponent
} from "@app/modules/reports/report-dynamic/report-dynamic-export/entry-components/input-mass-position-women-selector.component";
import {
    InputMassPositionYouthSelectorComponent
} from "@app/modules/reports/report-dynamic/report-dynamic-export/entry-components/input-mass-position-youth-selector.component";
import {
    InputMassPositionUnionSelectorComponent
} from "@app/modules/reports/report-dynamic/report-dynamic-export/entry-components/input-mass-position-union-selector.component";
import {
    InputEmployeeSelectorComponent
} from "@app/modules/reports/report-dynamic/report-dynamic-export/entry-components/input-employee-selector.component";
import {
    InputEmployeeManagerSelectorComponent
} from "@app/modules/reports/report-dynamic/report-dynamic-export/entry-components/input-employee-manager-selector.component";
import {
    InputPartyMemberSelectorComponent
} from "@app/modules/reports/report-dynamic/report-dynamic-export/entry-components/input-party-member-selector.component";
import {
    InputMassMemberWomenSelectorComponent
} from "@app/modules/reports/report-dynamic/report-dynamic-export/entry-components/input-mass-member-women-selector.component";
import {
    InputMassMemberYouthSelectorComponent
} from "@app/modules/reports/report-dynamic/report-dynamic-export/entry-components/input-mass-member-youth-selector.component";
import {
    InputMassMemberUnionSelectorComponent
} from "@app/modules/reports/report-dynamic/report-dynamic-export/entry-components/input-mass-member-union-selector.component";
import {
    InputComboboxComponent
} from "@app/modules/reports/report-dynamic/report-dynamic-export/entry-components/input-combobox.component";
import {
    InputDatePickerComponent
} from "@app/modules/reports/report-dynamic/report-dynamic-export/entry-components/input-date-picker.component";
import {
    InputGenderComponent
} from "@app/modules/reports/report-dynamic/report-dynamic-export/entry-components/input-gender.component";
import {
    InputTextComponent
} from "@app/modules/reports/report-dynamic/report-dynamic-export/entry-components/input-text.component";
import {
    ReportInputGenerateComponent
} from "@app/modules/reports/report-dynamic/report-dynamic-export/report-input-generate.component";
import {
    ReportInputGenerateDirective
} from "@app/modules/reports/report-dynamic/report-dynamic-export/report-input-generate.directive";
import {
    InputUnionOrgNoPermissionSelectorComponent
} from "@app/modules/reports/report-dynamic/report-dynamic-export/entry-components/input-union-org-no-permission-selector.component";

@Component({
    selector: 'report-dynamic-export-new',
    templateUrl: './report-dynamic-export-new-popup.component.html',
    styleUrls: ['./report-dynamic-export-new-popup.css']
})
export class ReportDynamicExportNewPopupComponent extends BaseComponent implements OnInit {
    formSave: FormGroup;
    formConfig: any = {
        reportDynamicId: [0, ValidationService.required]
    };
    navigationSubscription;
    reportDynamicId: number;
    reportDynamicName: String;
    selectedReport: any;
    isAllowSearch: any;
    isHideSelectReport: Boolean;
    listReportDynamic = [];
    resultList: UserMenu[] = [];
    reportTypeId: number;
    paramId = null;
    reportFillter = '';
    // kien
    urlSpecial = null;
    //
    dataExport: any = {};
    dataColumns: any = [];
    urlPreview;
    fileName;
    reportUrl;
    isSize: boolean = false;
    @ViewChild(ReportInputGenerateDirective) inputGenerate: ReportInputGenerateDirective;

    constructor(public actr: ActivatedRoute
        , public reportDynamicService: ReportDynamicService
        , private componentFactoryResolver: ComponentFactoryResolver
        , private modalService: NgbModal
        , public sanitizer: DomSanitizer
        , private app: AppComponent
        , private exportDynamicService: ExportDynamicService
        , public activeModal: NgbActiveModal
        , private router: Router) {

        super(actr, CommonUtils.getPermissionCode("resource.reportDynamic"));
        this.isHideSelectReport = false;
        this.isAllowSearch = false;
        this.formSave = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW);
        this.navigationSubscription = this.router.events.subscribe((e: any) => {
            // If it is a NavigationEnd event re-initalise the component
            if (e instanceof NavigationEnd) {
                const menuCode = this.actr.snapshot.params.menuCode;
                if (menuCode) {
                    this.buildListTypeSearch(menuCode);
                }
                this.reportDynamicId = this.actr.snapshot.params.id;
                if (this.reportDynamicId) {
                    var that = this;
                    this.isHideSelectReport = true;
                    this.loadReferenceById(this.reportDynamicId);
                    setTimeout(function () {
                        that.loadReportDynamicById(that.reportDynamicId);
                    }, 1000);
                    this.f['reportDynamicId'].setValue(this.reportDynamicId);
                }
                else {
                    this.isHideSelectReport = false;
                    this.loadReference();
                }
            }
        });
    }

    ngOnInit() {
    }

    get f() {
        return this.formSave.controls;
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

    private loadReferenceById(reportDynamicId): void {
        this.reportDynamicService.findOne(reportDynamicId).subscribe(res => {
            if (res && res.data) {
                this.listReportDynamic = [res.data];
                if (this.listReportDynamic.length > 0) {
                    this.reportDynamicName = this.listReportDynamic[0].name;
                }
            }
        });
    }

    private loadReference(): void {
        this.reportDynamicService.getListExport().subscribe(res => {
            if (res && res.data) {
                for (let i = 0; i < res.data.length; i++) {
                    let parent = res.data[i];
                    if (parent.items.length > 0) {
                        for (let j = 0; j < parent.items.length; j++) {
                            if (!this.checkPermission(CommonUtils.getPermissionByResourceCode(parent.items[j].code), "action.view")) {
                                parent.items.splice(j, 1);
                                j--;
                            }
                        }

                        if (parent.items.length == 0) {
                            res.data.splice(i, 1);
                            i--;
                        }
                    } else {
                        res.data.splice(i, 1);
                        i--;
                    }
                }
                this.listReportDynamic = res.data;
                // this.changeReportDynamic(this.listReportDynamic[0].items[0].value);
            }
        });
    }

    public setFormValue(data: any) {
        this.reportDynamicId = data.reportDynamicId
        this.changeReportDynamic(this.reportDynamicId)
    }

    cancel(){
        this.activeModal.close();
    }

    changeSizePopup(isSize: boolean){
        this.isSize = isSize;
        const modelBackdrop = document.getElementsByClassName("modal fade show d-block modal-xl");
        Array.prototype.forEach.call(modelBackdrop, function (element) {
            let style = ''
            if(isSize){
                style = 'max-width: 100% !important; ' +
                    'width: 100%; ' +
                    'margin: unset'
            }
            element.setAttribute('style', style)
        })
        const modelDialog = document.getElementsByClassName("modal-dialog modal-lg");
        Array.prototype.forEach.call(modelDialog, function (element) {
            let style = ''
            if(isSize){
                style = 'max-width: 100% !important; ' +
                    'width: 100%; ' +
                    'max-height: 100%; ' +
                    'height: 100%;' +
                    'margin: unset'
            }
            element.setAttribute('style', style)
        })
        const model = document.getElementsByClassName("modal-content");
        Array.prototype.forEach.call(model, function (element) {
            let style = ''
            if(isSize){
                style = 'max-width: 100%; ' +
                    'width: 100%; ' +
                    'max-height: 100%; ' +
                    'height: 100%'
            }
            element.setAttribute('style', style)
        })
    }

    public changeReportDynamic(reportDynamicId): void {
        // Clear old controls
        this.urlPreview = null;
        // this.inputGenerate.viewContainerRef.clear();
        if (reportDynamicId) {
          this.reportDynamicId = reportDynamicId;
          this.formSave = this.buildForm({ reportDynamicId: reportDynamicId }, this.formConfig, ACTION_FORM.INSERT);
          // load controls for current report
          this.reportDynamicService.findOne(reportDynamicId).subscribe(res => {
            this.reportDynamicName = res.data.name
            this.selectedReport = res.data;
            this.reportUrl = res.data.reportUrl;
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
            this.formSave.addControl(param.parameterCode,
                CommonUtils.createControl(ACTION_FORM.VIEW, param.parameterCode, null, validateFn, this.propertyConfigs));
            // load component
            if (param.dataType === REPORT_DYNAMIC_CONDITION_TYPE.COMBOBOX_CONDITION && param.description) {
                  this.reportDynamicService.getSelectData(param.reportParameterId).subscribe(async resp => {
                    selectData = resp.data;
                this.loadComponent(this.formSave.controls[param.parameterCode], param, param.selectData);
                  });
                continue;
            }
            if (param.dataType === REPORT_DYNAMIC_CONDITION_TYPE.COMBOBOX) {
                selectData = JSON.parse(param.description);
                this.loadComponent(this.formSave.controls[param.parameterCode], param, selectData);
                continue;
            }
            this.loadComponent(this.formSave.controls[param.parameterCode], param);
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
            case REPORT_DYNAMIC_CONDITION_TYPE.UNION_ORGANIZATION_NO_PERMISSION:
                componentFactory = this.componentFactoryResolver.resolveComponentFactory(InputUnionOrgNoPermissionSelectorComponent);
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

    buildListTypeSearch(menuCode) {
        this.resultList = [];
        const lsMenu = HrStorage.getUserToken();
        for (const item of lsMenu.userMenuList) {
            if (item.code === menuCode) {
                this.paramId = item.sysMenuId;
                break;
            }
        }
        for (const data of lsMenu.userMenuList) {
            if (!CommonUtils.isNullOrEmpty(this.paramId) && data.parentId === this.paramId) {
                this.resultList.push(data);
            }
        }
        this.resultList.sort((a, b) => {
            return a.sortOrder - b.sortOrder;
        });
        this.onSelectReportType(this.resultList[0]);
    }

    onSelectReportType(item): void {
        this.reportTypeId = item.sysMenuId;
        this.urlPreview = null;
        // Clear old controls
        if (!CommonUtils.isNullOrEmpty(this.inputGenerate)) {
            this.inputGenerate.viewContainerRef.clear();
        }
        // kien sua
        const paramId = item.url.split('/');
        this.reportDynamicId = parseInt(paramId[paramId.length - 1]);
        this.urlSpecial = item.url.includes('report-dynamic-special') ? paramId[paramId.length - 2] : null;
        // kien sua
        if (this.reportDynamicId) {
            this.formSave = this.buildForm({ reportDynamicId: this.reportDynamicId }, this.formConfig, ACTION_FORM.INSERT);
        }
        if (this.reportDynamicId) {
            // load controls for current report
            this.reportDynamicService.findOne(this.reportDynamicId).subscribe(res => {
                this.selectedReport = res.data;
                this.rebuildForm();
            });
        }
    }

    downloadFileExport() {
        let urlPreview;
        if (CommonUtils.isValidForm(this.formSave)) {
            if (this.isHideSelectReport) {
                this.formSave.value.reportDynamicId = this.reportDynamicId;
            }
            const self = this;
            if (!this.formSave.value.reportDynamicId) {
                this.formSave.value.reportDynamicId = this.reportDynamicId;
            }
            const reqData = this.formSave.value;
            this.app.isProcessing(true);
            if (this.reportUrl) {
                this.export(reqData);
            } else {
                this.exportDynamicService.export(reqData)
                    .subscribe(res => {
                        urlPreview = this.exportDynamicService.serviceUrl + "/preview/" + res.filePath;
                        this.fileName = res.fileName;
                        urlPreview = this.sanitizer.bypassSecurityTrustResourceUrl(urlPreview);

                        let url = { ...urlPreview };
                        url = url.changingThisBreaksApplicationSecurity;
                        url = url.replace('/preview/', '/download/') + "/" + this.fileName
                        window.location.href = url;
                    });
            }
        }
    }

    previewExport() {
        if (CommonUtils.isValidForm(this.formSave)) {
            if (this.isHideSelectReport) {
                this.formSave.value.reportDynamicId = this.reportDynamicId;
            }
            const self = this;
            if (!this.formSave.value.reportDynamicId) {
                this.formSave.value.reportDynamicId = this.reportDynamicId;
            }
            const reqData = this.formSave.value;
            this.app.isProcessing(true);
            this.urlPreview = null;
            if (this.reportUrl) {
                this.export(reqData);
            } else {
                this.exportDynamicService.export(reqData)
                    .subscribe(res => {
                        this.urlPreview = this.exportDynamicService.serviceUrl + "/preview/" + res.filePath;
                        this.fileName = res.fileName;
                        // let data = res;
                        // if (res.type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
                        //   data = await this.reportDynamicService.convertExcelToPDF(res).toPromise();
                        // } else if (res.type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
                        //   data = await this.reportDynamicService.convertDocxToPDF(res).toPromise();
                        // }
                        this.urlPreview = this.sanitizer.bypassSecurityTrustResourceUrl(this.urlPreview);
                    });
            }
        }
    }


    /**
     * export
     */
    export(reqData) {
        this.exportDynamicService.postRequest(environment.serverUrl['report'] + this.reportUrl, reqData)
            .subscribe(res => {
                this.urlPreview = this.exportDynamicService.serviceUrl + "/preview/" + res.filePath;
                this.fileName = res.fileName;
                this.urlPreview = this.sanitizer.bypassSecurityTrustResourceUrl(this.urlPreview);
            });
    }

    exportTables(event?) {
        if (CommonUtils.isValidForm(this.formSave)) {
            this.formSave.value.reportDynamicId = this.reportDynamicId;
            const reqData = this.formSave.value;
            // this.app.isProcessing(true);
            this.dataColumns = [];
            for (let idx in this.selectedReport.lstReportColumn) {
                this.dataColumns.push(
                    {
                        "field": this.selectedReport.lstReportColumn[idx].aliasName.toUpperCase(),
                        "header": this.selectedReport.lstReportColumn[idx].name,
                        "isSortable": true,
                        "width": this.selectedReport.lstReportColumn[idx].width + 'px'
                    });
            }

            this.reportDynamicService.exportTables(reqData, event).subscribe((res) => {
                this.dataExport = res;
            });
            if (!event) {
                if (this.dataTable) {
                    this.dataTable.first = 0;
                }
            }
        }
    }

    // kien start
    exportGeneral() {
        if (this.urlSpecial == null) {
            // this.export();
        } else {
            this.exportSpecial();
        }
    }

    exportSpecial() {
        if (CommonUtils.isValidForm(this.formSave)) {
            if (this.isHideSelectReport) {
                this.formSave.value.reportDynamicId = this.reportDynamicId;
            }
            const reqData = this.formSave.value;
            this.app.isProcessing(true);
            this.reportDynamicService.exportSpecial(reqData, this.urlSpecial)
                .subscribe((res) => {
                    this.app.isProcessing(false);
                    if (res.type === 'application/json') {
                        const reader = new FileReader();
                        reader.addEventListener('loadend', (e) => {
                            const text = e.srcElement['result'];
                            const json = JSON.parse(text);
                            this.reportDynamicService.processReturnMessage(json);
                        });
                        reader.readAsText(res);
                    } else {
                        let nameFile;
                        for (const item of this.resultList) {
                            if (item.url.indexOf(reqData.reportDynamicId) >= 0) {
                                nameFile = item.name;
                                break;
                            }
                        }
                        let extension = '';
                        if (res.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
                            extension = '.xlsx';
                        } else if (res.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                            extension = '.docx';
                        } else {
                            extension = '.pdf';
                        }
                        saveAs(res, nameFile + extension);
                    }
                });
        }
    }

    checkPermission(permissions: any, operationKey: string): boolean {
        if (!permissions || permissions.length <= 0) {
            return false;
        }
        const rsSearch = permissions.findIndex(x => x.operationCode === CommonUtils.getPermissionCode(operationKey));
        if (rsSearch < 0) {
            return false;
        }
        return true;
    }
    // end
}
