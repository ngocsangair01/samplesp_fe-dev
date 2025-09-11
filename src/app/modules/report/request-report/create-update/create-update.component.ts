import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import {APP_CONSTANTS, DynamicApiService, MAP_YCBC_OBJECT_TYPE, RequestReportService, SCHEDULE_TYPE} from '@app/core';
import { AppParamService } from '@app/core/services/app-param/app-param.service';
import { AppComponent } from '@app/app.component';
import { DialogService } from 'primeng/api';
import { HelperService } from '@app/shared/services/helper.service';
import { forkJoin, Observable } from 'rxjs';
import { FileStorageService } from '@app/core/services/file-storage.service';
import { FileControl } from '@app/core/models/file.control';
import { CreateBusinessTypeComponent } from '../dialog/create-business-type-dialog.component';
import { Router } from '@angular/router';
import { TranslationService } from 'angular-l10n';
import {ReportConfigService} from "@app/core/services/report/report-config.service";
import {HrStorage} from "@app/core/services/HrStorage";

const TEMPLATE_FILE_TYPE = 100;
const ATTACHMENT_FILE_TYPE = 101;

@Component({
  selector: 'create-update',
  templateUrl: './create-update.component.html',
  styleUrls: ['./create-update.component.css']
})
export class CreateOrUpdateComponent extends BaseComponent implements OnInit, AfterViewInit {
  @ViewChild('tableInput') tableInput: any;

  @ViewChild('orgSelector') orgSelector: any;
  @ViewChild('massOrgSelector') massOrgSelector: any;
  @ViewChild('partyOrgSelector') partyOrgSelector: any;

  @ViewChild('requestReportOrg') requestReportOrg: any;

  @ViewChild('scheduleSelector') scheduleSelector: any;

  formConfig;

  viewMode;

  checkShowMoveFile = false;

  isClone = false;

  formGroup: FormGroup;

  typeOfReportOptions;
  userLogin = HrStorage.getUserToken().employeeCode

  adReportTemplateIdOptions;

  belongsToTheProgramOptions;
  businessTypeOptions;

  dataTypeOptions;
  fileTemplateName: any;
  secretIdTemplate: any;
  header;
  createdBy: any;
  disable;
  isMasO: boolean = false;
  isPartyO: boolean = false;
  isOrg: boolean = false;
  isLabel: boolean = false;
  branch: any;
  rewardType: any;
  isMobileScreen: boolean = false;
  tabeInputConfig = [
    {
      header: "common.table.index",
      width: "7%"
    },
    {
      header: "common.label.action",
      width: "15%"
    },
    {
      header: "app.reportDynamic.column.dataType",
      width: "40%"
    },
    {
      header: "label.report.criteriaName",
      width: "40%"
    }
  ]

  tableFormConfig = {
    requestReportingId: [null],
    requestReportingCriteriaId: [null],
    dataType: [null],
    criterialName: [null],
  }
  constructor(
    private service: RequestReportService,
    private appParamService: AppParamService,
    private app: AppComponent,
    public dialogService: DialogService,
    public helperService: HelperService,
    private dynamicApiService: DynamicApiService,
    private fileStorageService: FileStorageService,
    private router: Router,
    private formBuilder: FormBuilder,
    private translation: TranslationService,
    private fileStorage: FileStorageService,
    private reportConfigService : ReportConfigService,
  ) {
    super();
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
  }

  ngAfterViewInit() {
    forkJoin(
      [
        this.appParamService.appParams("TYPE_OF_REPORT"),
        this.service.getBusinessType(),
        this.appParamService.appParams("DATA_TYPE"),
        this.dynamicApiService.getByCode('get-activity-program'),
      ]
    ).subscribe(res => {
      this.typeOfReportOptions = res[0].data;
      this.businessTypeOptions = res[1].data;
      this.dataTypeOptions = res[2].data;
      this.belongsToTheProgramOptions = res[3];
      let url = this.router.url.split("/");
      const urlClone = url[url.length-1]
      if (history.state.requestReportingId && urlClone != "clone") {
        this.viewMode ? this.header = "Xem yêu cầu báo cáo" : this.header = "Sửa yêu cầu báo cáo"
        this.setDataIntoForm(history.state.requestReportingId);
      } else if(history.state.requestReportingId) {
        this.header = "Thêm mới yêu cầu báo cáo";
        this.setDataIntoFormClone(history.state);
      } else {
        this.header = "Thêm mới yêu cầu báo cáo";
        if (this.businessTypeOptions && this.businessTypeOptions.length > 0) {
          this.formGroup.controls['businessType'].setValue(this.businessTypeOptions[0]);
        }
        this.reportConfigService.findTemplateActive(this.businessTypeOptions[0].parValue).subscribe( res => {
          this.adReportTemplateIdOptions = res.data
        })
        this.handleChangeBusinessType();
      }
    })
  }

  ngOnInit() {
    this.viewMode = this.router.url == '/report/request-report/view';
    this.isClone = this.router.url == '/report/request-report/clone';
    this.setConfigForm();
    this.formGroup = this.buildForm({isSignRequired: 0, isApproveRequired: 0, isImportRequired: 0}, this.formConfig);
    this.formGroup.setControl('requestReportOrg', new FormArray([], ValidationService.required));
    this.formGroup.value.typeOfReport = { parValue: 'DOT_XUAT' };
    this.checkShowMoveFile = this.router.url.includes('/report/request-report/view') ? false : true;
  }

  setDataIntoForm(requestReportingId) {
    this.service.findOne(requestReportingId).subscribe(res => {
      this.createdBy = res.createdBy
      res.businessType = this.businessTypeOptions.find(e => { return e.parValue == res.businessType });
      this.reportConfigService.findTemplateActive(res.businessType.parValue).subscribe( resChild => {
        this.adReportTemplateIdOptions = resChild.data
        if (res.activityProgramId){
          res.belongsToTheProgram = this.belongsToTheProgramOptions.find(e => { return e.activityProgramId == res.activityProgramId });
        }else{
          res.belongsToTheProgram = null
        }
        res.typeOfReport = this.typeOfReportOptions.find(e => { return e.parValue == res.typeOfReport });

        let requestReportOrg = [];
        for (let e of res.requestReportOrg) {
          requestReportOrg.push(e.organizationId);
        }
        res.requestReportOrg = []
        this.setCriteriaForm(res.reportingCriteria);
        if (res.typeOfReport.parValue == "DOT_XUAT") {
          res.reportingDeadline = !CommonUtils.isNullOrEmpty(res.requestReportSchedule) ? res.requestReportSchedule.scheduleDate : ""
          // res.reportingDeadline.split("/")[1] + "/" + res.reportingDeadline.split("/")[0] + "/" + res.reportingDeadline.split("/")[2] : "";
        } else {
          setTimeout(() => {
            this.scheduleSelector.setPropertyValue(res.requestReportSchedule);
          }, 0)
        }
        delete res.reportingCriteria;
        delete res.activityProgramId;
        res.adReportTemplateId = this.adReportTemplateIdOptions.find(e => { return e.adReportTemplateId == res.adReportTemplateId });
        this.formGroup.patchValue(res);
        this.selectedChange();
        this.setFileIntoForm(res.templateFile, "templateFile");
        this.setFileIntoForm(res.attachFile, "attachFile");
        this.formGroup.setControl('requestReportOrg', this.formBuilder.array(requestReportOrg, ValidationService.required));
        this.check(res.requestReportingId);
        this.changeDataValue();
        // this.orgSelector.onChangeOrgId();
        // this.massOrgSelector.onChangeOrgId();
        // this.partyOrgSelector.onChangeOrgId();
        // this.requestReportOrg.onChangeOrgId();
      })
    })
  }

  setDataIntoFormClone(data) {
    this.service.findOne(data.requestReportingId).subscribe(res => {
      this.formGroup.controls['requestReportingIdOld'].setValue(data.requestReportingId);
      res.title = null;
      res.reportingDeadline = null;
      res.startDate = null;
      res.endDate = null;
      res.businessType = this.businessTypeOptions.find(e => { return e.parValue == res.businessType });
      if (res.activityProgramId){
        res.belongsToTheProgram = this.belongsToTheProgramOptions.find(e => { return e.activityProgramId == res.activityProgramId });
      }else{
        res.belongsToTheProgram = null
      }
      res.typeOfReport = this.typeOfReportOptions.find(e => { return e.parValue == res.typeOfReport });

      let requestReportOrg = [];
      for (let e of res.requestReportOrg) {
        requestReportOrg.push(e.organizationId);
      }
      res.requestReportOrg = []
      res.templateFile = data && !data.checkbox1 ? [] : res.templateFile
      res.attachFile = data && !data.checkbox2 ? [] : res.attachFile
      this.setCriteriaForm(res.reportingCriteria);
      if (res.typeOfReport.parValue == "DOT_XUAT") {
        res.reportingDeadline = !CommonUtils.isNullOrEmpty(res.requestReportSchedule) ? res.requestReportSchedule.scheduleDate : ""
        res.reportingDeadline = null;
          // res.reportingDeadline.split("/")[1] + "/" + res.reportingDeadline.split("/")[0] + "/" + res.reportingDeadline.split("/")[2] : "";
      } else {
        setTimeout(() => {
          this.scheduleSelector.setPropertyValue(res.requestReportSchedule);
        }, 0)
      }
      delete res.reportingCriteria;
      delete res.activityProgramId;
      this.formGroup.patchValue(res);
      res.templateFile = data && !data.checkbox1 ? [] : res.templateFile
      res.attachFile = data && !data.checkbox2 ? [] : res.attachFile
      if (data && data.checkbox1) {
        this.setFileIntoForm(res.templateFile, "templateFile");
        this.formGroup.controls['checkboxTemplateFile'].setValue(1);
      }
      if (data && data.checkbox2) {
        this.setFileIntoForm(res.attachFile, "attachFile");
        this.formGroup.controls['checkboxAttachFile'].setValue(1);
      }
      this.formGroup.setControl('requestReportOrg', this.formBuilder.array(requestReportOrg, ValidationService.required));
      this.check(res.requestReportingId);
      this.changeDataValue();
      this.orgSelector.onChangeOrgId();
      this.requestReportOrg.onChangeOrgId();
    })
  }



  setCriteriaForm(reportingCriteria) {
    let formArray = new FormArray([]);
    for (let criteriaValue of reportingCriteria) {
      let criteriaForm = this.buildForm('', this.tableFormConfig);
      // let criteriaValue: any = {...e};
      for (let dataType of this.dataTypeOptions) {
        if (dataType.parValue == criteriaValue.typeOfData) {
          criteriaValue.dataType = dataType;
          break;
        }
      }
      delete criteriaValue.typeOfData;
      delete criteriaValue.createdBy;
      delete criteriaValue.createdTime;
      if (!criteriaValue.dataType) {
        criteriaValue.dataType = 'String';
      }
      criteriaForm.setValue(criteriaValue);
      formArray.push(criteriaForm);
    }
    if (reportingCriteria.length == 0){
      formArray.push(this.buildForm('', this.tableFormConfig));
    }
    // this.tableInput.formArray = formArray;
  }
  
  setFileIntoForm(file, controlName) { 
    let templateFileControl = [];
    let templateFileAtt = []; 
    for (let e of file) {
      let file = new File([''], e[1], { type: 'vhr_stored_file' });
      templateFileControl.push(file);    
      if (this.isClone) {
        templateFileAtt.push({ isTemp: true, secretId: e.secretId, fileName: e.fileName , attachmentFileId: e.attachmentFileId}) 
      } else {
        templateFileAtt.push({ isTemp: false, secretId: e.secretId, fileName: e.fileName, attachmentFileId: e.attachmentFileId}) 
      }
    }
    let fileControl = new FileControl();
    fileControl.setValue(templateFileControl);
    fileControl.setFileAttachment(templateFileAtt);
    this.formGroup.setControl(controlName, fileControl);
  }

  previous() {
    this.router.navigateByUrl('/report/request-report');
  }

  save() {
    const listTemplateFile = this.formGroup.controls['templateFile']['fileAttachment']
    listTemplateFile.forEach((file) => {
      if(file && file.attachmentFileId) {
        file.id = file.attachmentFileId;
      }
    })
    const listTemplateFileOld = listTemplateFile.filter((file) => file.id && file.id > 0)
    if (listTemplateFileOld) {
      this.formGroup.controls['listTemplateFileOld'].setValue(listTemplateFileOld);
    }

    const listAttachFile = this.formGroup.controls['attachFile']['fileAttachment']
    listAttachFile.forEach((file) => {
      if(file && file.attachmentFileId) {
        file.id = file.attachmentFileId;
      }
    })
    const listAttachFileOld = listAttachFile.filter((file) => file.id && file.id > 0)
    if (listAttachFileOld) {
      this.formGroup.controls['listAttachFileOld'].setValue(listAttachFileOld);
    }
    if(this.formGroup.value.isImportRequired == 1){
      this.formGroup.get('adReportTemplateId').setValue(this.formGroup.value.adReportTemplateId.adReportTemplateId)
    }
    if (CommonUtils.isValidForm(this.formGroup) && this.validateCriteria() && this.validateStartAndEndDate()) {
      this.app.confirmMessage(null,
        () => {
          this.service.processSaveOrUpdate(this.getParam())
            .subscribe(res => {
              this.formGroup.controls.requestReportingIdEncrypt.setValue(res.data.requestReportingIdEncrypt);
              this.formGroup.controls.requestReportingId.setValue(res.data.requestReportingId);
              // thực hiện về màn hình danh sách
              this.router.navigateByUrl('/report/request-report/view', { state: this.formGroup.value });
            })
        },
        () => { }
      )
    }

  }

  clone(){
    this.formGroup.controls['requestReportingId'].setValue(null);
    const listTemplateFile = this.formGroup.controls['templateFile']['fileAttachment']
    listTemplateFile.forEach((file) => {
      if(file && file.attachmentFileId) {
        file.id = file.attachmentFileId;
      }
    })
    const listTemplateFileOld = listTemplateFile.filter((file) => file.id && file.id > 0)
    if (listTemplateFileOld) {
      this.formGroup.controls['listTemplateFileOld'].setValue(listTemplateFileOld);
    }

    const listAttachFile = this.formGroup.controls['attachFile']['fileAttachment']
    listAttachFile.forEach((file) => {
      if(file && file.attachmentFileId) {
        file.id = file.attachmentFileId;
      }
    })
    const listAttachFileOld = listAttachFile.filter((file) => file.id && file.id > 0)
    if (listAttachFileOld) {
      this.formGroup.controls['listAttachFileOld'].setValue(listAttachFileOld);
    }
    if (CommonUtils.isValidForm(this.formGroup) && this.validateCriteria() && this.validateStartAndEndDate()) {
      this.app.confirmMessage(null,
        () => {
          this.service.processClone(this.getParam())
            .subscribe(res => {
              this.formGroup.controls.requestReportingIdEncrypt.setValue(res.data.requestReportingIdEncrypt);
              this.formGroup.controls.requestReportingId.setValue(res.data.requestReportingId);
              // thực hiện về màn hình danh sách
              this.router.navigateByUrl('/report/request-report/view', { state: this.formGroup.value });
            })
        },
        () => { }
      )
    }
  }

  uploadFile() {
    let observable = []
    if (this.getUploadFileObservable('templateFile')) {
      observable.push(this.getUploadFileObservable('templateFile'))
    }
    if (this.getUploadFileObservable('attachFile')) {
      observable.push(this.getUploadFileObservable('attachFile'))
    }
    if (observable.length > 0) {
      forkJoin(observable).subscribe(res => {
        this.helperService.APP_TOAST_MESSAGE.next({ type: "SUCCESS", code: "uploadFile" })
        this.setDataIntoForm(this.formGroup.value.requestReportingId);
        this.setDataIntoFormClone(this.formGroup.value.requestReportingId);
        // thực hiện về màn hình danh sách
        this.router.navigate(['/report/request-report']);
      });
    } else {
      // thực hiện về màn hình danh sách
      this.router.navigate(['/report/request-report']);
    }
  }

  getUploadFileObservable(controlName) {
    let fileControl: any = this.formGroup.controls[controlName];
    if (fileControl.value) {
      let file = [];
      for (let e of fileControl.fileAttachment) {
        if (!e.secretId && e.file) {
          file.push(e.file);
        }
      }
      if (file.length > 0) {
        return file;
      }
    }
    return null;
  }

  getParam() {
    let param = Object.assign({}, this.formGroup.value);
    if (!this.isClone) {
      delete param['templateFile'];
      delete param['attachFile'];
    }
    // let criterias = this.tableInput.formArray.value;
    param.businessType = param.businessType.parValue;
    param.activityProgramId = param.belongsToTheProgram ? param.belongsToTheProgram.activityProgramId : null;
    param.typeOfReport = param.typeOfReport.parValue;

    if (param.typeOfReport == "DOT_XUAT") {
      param.requestReportScheduleForm = {
        scheduleType: SCHEDULE_TYPE.DOT_XUAT,
        scheduleDate: new Date(param.reportingDeadline).toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' })
      }
    } else if (param.typeOfReport == "TUAN" && param.reportingDeadline) {
      param.requestReportScheduleForm = {
        scheduleType: SCHEDULE_TYPE.THEO_TUAN,
        repeatCycle: param.reportingDeadline.month,
        dayOfWeek: param.reportingDeadline.day
      }
    } else if (param.typeOfReport == "THANG" && param.reportingDeadline) {
      param.requestReportScheduleForm = {
        scheduleType: SCHEDULE_TYPE.THEO_THANG,
        repeatOption: param.reportingDeadline.repeatOption,
        dayOfWeek: param.reportingDeadline.dayOfWeek,
        repeatCycle: param.reportingDeadline.repeatCycle,
        repeatCycleOrder: param.reportingDeadline.repeatCycleOrder,
        dayOfMonth: param.reportingDeadline.dayOfMonth
      }
    } else if (param.typeOfReport == "QUY" && param.reportingDeadline) {
      param.requestReportScheduleForm = {
        scheduleType: SCHEDULE_TYPE.THEO_QUY,
        repeatOption: param.reportingDeadline.repeatOption,
        dayOfMonth: param.reportingDeadline.dayOfMonth,
        monthOfQuarter: param.reportingDeadline.monthOfQuarter,
        quarterOfYear: param.reportingDeadline.quarterOfYear,
        dayOfWeek: param.reportingDeadline.dayOfWeek,
        repeatCycleOrder: param.reportingDeadline.repeatCycleOrder,
      }
    } else if (param.typeOfReport == "NAM" && param.reportingDeadline) {
      param.requestReportScheduleForm = {
        scheduleType: SCHEDULE_TYPE.THEO_NAM,
        repeatOption: param.reportingDeadline.repeatOption,
        dayOfMonth: param.reportingDeadline.dayOfMonth,
        monthOfYear: param.reportingDeadline.monthOfYear,
        dayOfWeek: param.reportingDeadline.dayOfWeek,
        repeatCycleOrder: param.reportingDeadline.repeatCycleOrder
      }
    }
    // param.criteria = [];
    //
    // for (let criteria of criterias) {
    //   if (criteria.dataType && criteria.criterialName) {
    //     criteria.typeOfData = criteria.dataType.parValue;
    //     param.criteria.push(criteria);
    //   }
    // }

    // build file upload
    if (this.getUploadFileObservable('templateFile')) {
      param.templateFile = this.getUploadFileObservable('templateFile')
    }
    if (this.getUploadFileObservable('attachFile')) {
      param.attachFile = this.getUploadFileObservable('attachFile')
    }
    return param;
  };

  validateCriteria() {
    // let criterias = this.tableInput.formArray.value;
    // let creiateraMap = {}
    // for (let e of criterias) {
    //   if (creiateraMap[e.criterialName]) {
    //
    //     this.helperService.APP_TOAST_MESSAGE.next({ type: 'ERROR', code: "report.criteriaConflict" });
    //     return false;
    //   }
    //   creiateraMap[e.criterialName] = true;
    // }
    return true;
  }

  validateStartAndEndDate(){
    let startDate = this.formGroup.value.startDate;
    let endDate = this.formGroup.value.endDate;
    if (startDate && endDate && startDate > endDate){
      this.helperService.APP_TOAST_MESSAGE.next({ type: 'ERROR', code: "retirementReport" });
      return false;
    }
    return true;
  }

  openDialogAddBusinessType() {
    const ref = this.dialogService.open(CreateBusinessTypeComponent, {
      header: 'Thêm mới chương trình hành động',
      width: '35%',
      baseZIndex: 2000,
      contentStyle: {"padding": "0"},
    });
    ref.onClose.subscribe( (isAdd) => {
      if (isAdd){
        this.dynamicApiService.getByCode('get-activity-program')
        .subscribe(res => {
          this.belongsToTheProgramOptions = res;
        })
      }

    });
  }

  setConfigForm() {
    this.formConfig = {
      requestReportingIdEncrypt: [null],
      requestReportingId: [null],
      businessType: [null, ValidationService.required],
      organizationId: [null, ValidationService.required],
      title: [null, ValidationService.required],
      belongsToTheProgram: [null],
      templateFile: [null],
      attachFile: [null],
      typeOfReport: ['', ValidationService.required],
      reportingDeadline: [null, ValidationService.required],
      startDate: [null, ValidationService.required],
      endDate: [null],
      requestReportOrg: [null, ValidationService.required],
      description: [null],
      isSignRequired: [null],
      isApproveRequired: [null],
      requestReportSchedule: [null],
      objectType: [null],
      checkboxTemplateFile: [null],
      checkboxAttachFile: [null],
      requestReportingIdOld: [null],
      listTemplateFileOld: [null],
      listAttachFileOld: [null],
      isImportRequired: [null],
      adReportTemplateId: [null]
    }
  }

  handleChangeTypeOfReport() {
    this.formGroup.controls['reportingDeadline'].reset();
    if (this.scheduleSelector) {
      this.scheduleSelector.ngOnChanges()
    }
  }

  check(requestReportingId) {
    this.service.isExistsReportSubmission(requestReportingId).subscribe(req => {
      if(req.data == true) {
        this.disable = true;
      } else {
        this.disable = false;
      }
    })
  }

  handleChangeBusinessType() {  
    this.changeDataValue();
    this.reportConfigService.findTemplateActive(this.formGroup.value.businessType.parValue).subscribe( res => {
      this.adReportTemplateIdOptions = res.data
      this.formGroup.controls['adReportTemplateId'].setValue(null);
    })
    this.formGroup.removeControl('requestReportOrg');
    this.formGroup.setControl('requestReportOrg', new FormArray([], ValidationService.required));
    this.formGroup.removeControl('organizationId')
    this.formGroup.setControl('organizationId', new FormControl(null, ValidationService.required));
  }
  changeDataValue() {
    const mapParCode = MAP_YCBC_OBJECT_TYPE;

    const rewardType = this.formGroup.controls['businessType'].value;
    this.rewardType = rewardType
    this.isPartyO = false;
    this.isMasO = false;
    this.isOrg = false;
    this.isLabel = false;
    if (!rewardType) {
      return;
    }
    const parCode = rewardType.parValue;
    if (mapParCode[parCode] == 1) {
      this.isOrg = true;
      this.isLabel = true;
      this.formGroup.controls['objectType'].setValue(1);
    } else if (mapParCode[parCode] == 2) {
      this.isPartyO = true;
      this.isLabel = true;
      this.formGroup.controls['objectType'].setValue(2);
    } else if (mapParCode[parCode] == 3 || mapParCode[parCode] == 4 || mapParCode[parCode] == 5) {
      this.isMasO = true;
      this.isLabel = true;
      if (mapParCode[parCode] == 3) {//Phụ nữ
        this.branch = 1
      } else if (mapParCode[parCode] == 4) {// Công đoàn
        this.branch = 3
      } else if (mapParCode[parCode] == 5) {// thanh niên
        this.branch = 2
      }
      this.formGroup.controls['objectType'].setValue(mapParCode[parCode]);
    }
  }

  /**
   * thêm required khi chọn yêu cầu import dữ liệu báo cáo
   * @param event
   */
  changeRequireImport(event:any){
    this.formGroup.removeControl('adReportTemplateId');
    if(event.target.id === "isSignRequired_1"){
      this.formGroup.addControl('adReportTemplateId', new FormControl(null, ValidationService.required));
    }else{
      this.formGroup.addControl('adReportTemplateId', new FormControl(null));
    }
  }

  get f() {
    return this.formGroup.controls;
  }

  selectedChange(){
    if(this.formGroup.value.adReportTemplateId != null){
      this.reportConfigService.findOne(this.formGroup.value.adReportTemplateId.adReportTemplateId).subscribe(res => {
        this.secretIdTemplate = res.fileAttachment.fileImport[0].secretId;
        this.fileTemplateName = res.fileAttachment.fileImport[0].fileName;
      })
    }
  }

  downloadFile(){
    if(this.secretIdTemplate){
      this.fileStorage.downloadFile(this.secretIdTemplate).subscribe(res => {
        saveAs(res, this.fileTemplateName);
      });
    }
  }

  navigate() {
    this.router.navigateByUrl('/report/request-report/create-update', { state: this.formGroup.value });
  }
}
