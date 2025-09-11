import { Component, ComponentFactoryResolver, OnInit, Pipe, PipeTransform, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, LARGE_MODAL_OPTIONS, REPORT_DYNAMIC_CONDITION_TYPE, UserMenu } from '@app/core';
import { HrStorage } from '@app/core/services/HrStorage';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
;
import { ReportDynamicViewerComponent } from '../report-dynamic-viewer/report-dynamic-viewer.component';
import { ReportDynamicService } from '../report-dynamic.service';
import { InputComboboxComponent } from './entry-components/input-combobox.component';
import { InputDatePickerComponent } from './entry-components/input-date-picker.component';
import { InputEmployeeManagerSelectorComponent } from './entry-components/input-employee-manager-selector.component';
import { InputEmployeeSelectorComponent } from './entry-components/input-employee-selector.component';
import { InputGenderComponent } from './entry-components/input-gender.component';
import { InputMassMemberUnionSelectorComponent } from './entry-components/input-mass-member-union-selector.component';
import { InputMassMemberWomenSelectorComponent } from './entry-components/input-mass-member-women-selector.component';
import { InputMassMemberYouthSelectorComponent } from './entry-components/input-mass-member-youth-selector.component';
import { InputMassPositionUnionSelectorComponent } from './entry-components/input-mass-position-union-selector.component';
import { InputMassPositionWomenSelectorComponent } from './entry-components/input-mass-position-women-selector.component';
import { InputMassPositionYouthSelectorComponent } from './entry-components/input-mass-position-youth-selector.component';
import { InputOrgSelectorComponent } from './entry-components/input-org-selector.component';
import { InputPartyMemberSelectorComponent } from './entry-components/input-party-member-selector.component';
import { InputPartyOrgSelectorComponent } from './entry-components/input-party-org-selector.component';
import { InputPartyPositionSelectorComponent } from './entry-components/input-party-position-selector.component';
import { InputPositionSelectorComponent } from './entry-components/input-position-selector.component';
import { InputTextComponent } from './entry-components/input-text.component';
import { InputUnionOrgSelectorComponent } from './entry-components/input-union-org-selector.component';
import { InputWomenOrgSelectorComponent } from './entry-components/input-women-org-selector.component';
import { InputYouthOrgSelectorComponent } from './entry-components/input-youth-org-selector.component';
import { ReportInputGenerateComponent } from './report-input-generate.component';
import { ReportInputGenerateDirective } from './report-input-generate.directive';

@Component({
  selector: 'report-dynamic-export',
  templateUrl: './report-dynamic-export.component.html',
  styles: []
})
export class ReportDynamicExportComponent extends BaseComponent implements OnInit {
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
  @ViewChild(ReportInputGenerateDirective) inputGenerate: ReportInputGenerateDirective;

  constructor(public actr: ActivatedRoute
    , public reportDynamicService: ReportDynamicService
    , private componentFactoryResolver: ComponentFactoryResolver
    , private modalService: NgbModal
    , private app: AppComponent
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
      }
    });
  }

  public changeReportDynamic(reportDynamicId): void {
    // Clear old controls
    this.inputGenerate.viewContainerRef.clear();
    if (reportDynamicId) {
      this.reportDynamicId = reportDynamicId;
      this.formSave = this.buildForm({ reportDynamicId: reportDynamicId }, this.formConfig, ACTION_FORM.INSERT);
      // load controls for current report
      this.reportDynamicService.findOne(reportDynamicId).subscribe(res => {
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
      this.formSave.addControl(param.parameterCode,
        CommonUtils.createControl(ACTION_FORM.VIEW, param.parameterCode, null, validateFn, this.propertyConfigs));
      // load component
      if (param.dataType === REPORT_DYNAMIC_CONDITION_TYPE.COMBOBOX_CONDITION && param.description) {
        //   this.reportDynamicService.getSelectData(param.reportParameterId).subscribe(async resp => {
        //     selectData = resp.data;
        this.loadComponent(this.formSave.controls[param.parameterCode], param, param.selectData);
        //   });
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

  previewExport() {
    if (!CommonUtils.isValidForm(this.formSave)) {
      return;
    }
    if (!this.formSave.value.reportDynamicId) {
      this.formSave.value.reportDynamicId = this.reportDynamicId;
    }
    let data = this.formSave.value;
    data.reportName = this.selectedReport.name;
    const modalRef = this.modalService.open(ReportDynamicViewerComponent, LARGE_MODAL_OPTIONS);
    modalRef.componentInstance.setFormValue(this.formSave.value);
    modalRef.componentInstance.setData(this.urlSpecial);
  }

  /**
   * export
   */
  export() {
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
      this.reportDynamicService.export(reqData)
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
            var nameFile = self.selectedReport.name;
            var extension = "";
            if (res.type == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
              extension = ".xlsx";
            } else if (res.type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
              extension = ".docx";
            } else {
              extension = ".pdf";
            }
            saveAs(res, nameFile + extension);
          }
        });
    }
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
      this.export();
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

@Pipe({ name: 'filter' })
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    searchText = searchText.trim();
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLowerCase();
    return items.filter(it => {
      return it.name.toLowerCase().includes(searchText) || it.code.toLowerCase().includes(searchText);
    })
  }
}
