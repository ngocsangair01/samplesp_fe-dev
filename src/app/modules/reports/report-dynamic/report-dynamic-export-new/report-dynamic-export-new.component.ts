import { Component, ComponentFactoryResolver, OnInit, Pipe, PipeTransform, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import {
  ACTION_FORM,
  DEFAULT_MODAL_OPTIONS,
  MODAL_XL_OPTIONS,
  REPORT_DYNAMIC_CONDITION_TYPE,
  UserMenu
} from '@app/core';
import { HrStorage } from '@app/core/services/HrStorage';
import {
  ReportDynamicExportNewPopupComponent
} from "@app/modules/reports/report-dynamic/report-dynamic-export-new/report-dynamic-export-new-popup/report-dynamic-export-new-popup.component";
import {
  InputUnionOrgNoPermissionSelectorComponent
} from "@app/modules/reports/report-dynamic/report-dynamic-export/entry-components/input-union-org-no-permission-selector.component";
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { environment } from '@env/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
;
import { ExportDynamicService } from '../export-dynamic-service';
import { InputComboboxComponent } from '../report-dynamic-export/entry-components/input-combobox.component';
import { InputDatePickerComponent } from '../report-dynamic-export/entry-components/input-date-picker.component';
import { InputEmployeeManagerSelectorComponent } from '../report-dynamic-export/entry-components/input-employee-manager-selector.component';
import { InputEmployeeSelectorComponent } from '../report-dynamic-export/entry-components/input-employee-selector.component';
import { InputGenderComponent } from '../report-dynamic-export/entry-components/input-gender.component';
import { InputMassMemberUnionSelectorComponent } from '../report-dynamic-export/entry-components/input-mass-member-union-selector.component';
import { InputMassMemberWomenSelectorComponent } from '../report-dynamic-export/entry-components/input-mass-member-women-selector.component';
import { InputMassMemberYouthSelectorComponent } from '../report-dynamic-export/entry-components/input-mass-member-youth-selector.component';
import { InputMassPositionUnionSelectorComponent } from '../report-dynamic-export/entry-components/input-mass-position-union-selector.component';
import { InputMassPositionWomenSelectorComponent } from '../report-dynamic-export/entry-components/input-mass-position-women-selector.component';
import { InputMassPositionYouthSelectorComponent } from '../report-dynamic-export/entry-components/input-mass-position-youth-selector.component';
import { InputOrgSelectorComponent } from '../report-dynamic-export/entry-components/input-org-selector.component';
import { InputPartyMemberSelectorComponent } from '../report-dynamic-export/entry-components/input-party-member-selector.component';
import { InputPartyOrgSelectorComponent } from '../report-dynamic-export/entry-components/input-party-org-selector.component';
import { InputPartyPositionSelectorComponent } from '../report-dynamic-export/entry-components/input-party-position-selector.component';
import { InputPositionSelectorComponent } from '../report-dynamic-export/entry-components/input-position-selector.component';
import { InputTextComponent } from '../report-dynamic-export/entry-components/input-text.component';
import { InputUnionOrgSelectorComponent } from '../report-dynamic-export/entry-components/input-union-org-selector.component';
import { InputWomenOrgSelectorComponent } from '../report-dynamic-export/entry-components/input-women-org-selector.component';
import { InputYouthOrgSelectorComponent } from '../report-dynamic-export/entry-components/input-youth-org-selector.component';
import { ReportInputGenerateComponent } from '../report-dynamic-export/report-input-generate.component';
import { ReportInputGenerateDirective } from '../report-dynamic-export/report-input-generate.directive';
import { ReportDynamicService } from '../report-dynamic.service';
import { ReportDynamicImportModalComponent } from './report-dynamic-import-modal/report-dynamic-import-modal.component';

@Component({
  selector: 'report-dynamic-export-new',
  templateUrl: './report-dynamic-export-new.component.html',
  styleUrls: ['./report-dynamic-export-new.css']
})
export class ReportDynamicExportNewComponent extends BaseComponent implements OnInit {
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
  listReportDynamicPriority = [];
  dataPriority: any = [];
  resultList: UserMenu[] = [];
  reportTypeId: number;
  paramId = null;
  reportFillter = '';
  checkAll: boolean = true
  // kien
  urlSpecial = null;
  //
  dataExport: any = {};
  dataColumns: any = [];
  urlPreview;
  fileName;
  reportUrl;
  isMobileScreen: boolean = false;
  isAdmin: boolean = true;
  permission: string = 'CTCT_IMPORT_DAIHOI';
  @ViewChild(ReportInputGenerateDirective) inputGenerate: ReportInputGenerateDirective;

  constructor(public actr: ActivatedRoute
    , public reportDynamicService: ReportDynamicService
    , private componentFactoryResolver: ComponentFactoryResolver
    , private modalService: NgbModal
    , public sanitizer: DomSanitizer
    , private app: AppComponent
    , private exportDynamicService: ExportDynamicService
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
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
  }

  ngOnInit() {
    // check permission
    const users = HrStorage.getUserToken();
    const userPermissionList = users.userPermissionList;
    const isAdmin = userPermissionList.some(item => item.resourceCode.toLocaleLowerCase().includes(this.permission.toLocaleLowerCase()))
    if (!isAdmin) {
      this.isAdmin = false;
      console.log('không có quyền import')
    }
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
        this.listReportDynamicPriority = []
        for (let i = 0; i < res.data.length; i++) {
          let parent = res.data[i];
          Object.assign(res.data[i], { checkBoolean: true })
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
        for(let j=0; j<this.listReportDynamic.length; j++){
          for(let k=0; k< this.listReportDynamic[j].items.length; k++){
            if(this.listReportDynamic[j].items[k].isPriority === 1){
              this.listReportDynamicPriority.push(this.listReportDynamic[j].items[k])
            }
          }
        }
        this.updateReportPriority()
        // this.changeReportDynamic(this.listReportDynamic[0].items[0].value);
      }
    });
  }

  public changeReportDynamic(reportDynamicId): void {
    // call đến popup thay cho xem trực tiếp

    // Clear old controls
    // this.urlPreview = null;
    // this.inputGenerate.viewContainerRef.clear();
    // if (reportDynamicId) {
    //   this.reportDynamicId = reportDynamicId;
    //   this.formSave = this.buildForm({ reportDynamicId: reportDynamicId }, this.formConfig, ACTION_FORM.INSERT);
    //   // load controls for current report
    //   this.reportDynamicService.findOne(reportDynamicId).subscribe(res => {
    //     this.reportDynamicName = res.data.name
    //     this.selectedReport = res.data;
    //     this.reportUrl = res.data.reportUrl;
    //     if (this.selectedReport && this.selectedReport.formatReport === 'EXCEL_EXTENDS') {
    //       this.isAllowSearch = true;
    //     }
    //     this.rebuildForm();
    //   });
    // }
    const modalRef = this.modalService.open(ReportDynamicExportNewPopupComponent, MODAL_XL_OPTIONS);
    const data = {
      reportDynamicId: reportDynamicId
    }
    modalRef.componentInstance.setFormValue(data);
    modalRef.result.then((result) => {
      if (!result) {
        return;
      }
    });
  }

  changePriority(el:any, priority: number){
    let param = {
      reportDynamicId: el.value,
      numberCheck: priority
    }
    this.reportDynamicService.changePriority(param).subscribe(res => {
      if(res.type === "SUCCESS"){
        el.isPriority = priority
        if(priority == 1){
          this.listReportDynamicPriority.push(el)
        }else{
          this.listReportDynamicPriority = this.listReportDynamicPriority.filter((item: any) => item.value != el.value);
          this.updateReportPriority()
        }
      }
    })
  }

  updateReportPriority(){
    this.dataPriority = []
    this.dataPriority.push({
      checkBoolean: true,
      items: this.listReportDynamicPriority,
      label: "Báo cáo yêu thích"
    });
  }

  checkAllAction(){
    this.checkAll = !this.checkAll
    for (const item in this.listReportDynamic){
      this.listReportDynamic[item].checkBoolean = this.checkAll
    }
    this.dataPriority[0].checkBoolean = this.checkAll
  }

  changeListReport(item?: any){
    item.checkBoolean = !item.checkBoolean
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
    let url = {...this.urlPreview};
    url = url.changingThisBreaksApplicationSecurity;
    url =  url.replace('/preview/', '/download/') + "/" + this.fileName
    window.location.href = url;
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

  public openFormImport() {
    // if(!this.isAdmin){
    //   this.app.warningMessage('', 'Bạn không có quyền với chức năng này!');
    // }
    const modalRef = this.modalService.open(ReportDynamicImportModalComponent, DEFAULT_MODAL_OPTIONS);
    modalRef.result.then((result) => {
      if (!result) {
        return;
      }
      return;
    });
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

@Pipe({ name: 'filters' })
export class FilterPipeNew implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    searchText = searchText.trim();
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLowerCase();
    return items.filter(it => { return it.items.filter(element => element.label.toLowerCase().includes(searchText)).length > 0 }).map(el => {
      return { label: el.label, items: el.items.filter(e => { return e.label.toLowerCase().includes(searchText) }), checkBoolean:true }
    })
  }
}
