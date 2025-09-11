import { forkJoin } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { OBJECT_TYPE_LIST, RequestReportService, RESPONSE_TYPE } from '@app/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { FileStorageService } from '@app/core/services/file-storage.service';
import { AppComponent } from '@app/app.component';
import { FileControl } from '@app/core/models/file.control';
import { HelperService } from '@app/shared/services/helper.service';
import { ReportSubmissionService } from '@app/core/services/report/report-submission.service';
import { SignDocumentService } from '@app/core/services/sign-document/sign-document.service';
import { async } from 'rxjs/internal/scheduler/async';
import { ReportManagerService } from '@app/core/services/report/report-manager.service';
import { DialogService } from 'primeng/api';
import { RejectFormComponent } from '../reject-form/reject-form.component';
import { TranslationService } from 'angular-l10n';
import {FormArray, FormGroup} from "@angular/forms";
import {ReportConfigService} from "@app/core/services/report/report-config.service";

const REPORT_SUBMISSION_FILE_TYPE = 102;
const REPORT_SUBMISSION_APPENDIX_FILE_TYPE = 103;
const ISSIGNREQUIRED = 1;
const DA_XET_DUYET = "DA_XET_DUYET"
@Component({
  selector: 'create-report',
  templateUrl: './create-report.component.html',
  styleUrls: ['./create-report.component.css']
})
export class CreatReportSubmissionComponent extends BaseComponent implements OnInit {
  public dataError: any;
  formConfig;
  submissionInfo: any = {};
  reportingCriteria;
  formSubmit: any = {};
  hasTemplate = false;
  isApproveRequired: any = 0;
  isImportRequired: boolean = false;
  orgName: any;
  btnLabelCode = 'common.button.icon.saveAndSubmit';
  lstData: FormArray;
  listHeader = [];
  listBody = [];
  checkListBodyBySearch = [];
  tableFormConfig: any;
  viewMode = false;
  hasPermissionApprove = false;
  checkShowMoveFile = false;
  checkShowButtonExport = false;
  checkIsHasTemplate = false;
  checkIsManySheet = false;
  checkChangeFileImport = false;
  count = 10;
  status;
  keySearch = '';
  formSearchDataImport: FormGroup;
  isMobileScreen: boolean = false;
  formSearchConfig = {
    keyword: [null]
  };
  constructor(
    private router: Router,
    private service: ReportSubmissionService,
    private app: AppComponent,
    private requestReportService: RequestReportService,
    private fileStorageService: FileStorageService,
    public helperService: HelperService,
    private route: ActivatedRoute,
    private signDocumentService: SignDocumentService,
    private reportManagerService: ReportManagerService,
    public dialogService: DialogService,
    public reportConfigService : ReportConfigService,
  ) {
    super();
    this.setMainService(this.service);
    this.formSearchDataImport =  this.buildForm({}, this.formSearchConfig);
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
  }

  ngOnInit() {
    this.viewMode = this.router.url.includes('/report/report-submission/view') || this.router.url.includes('/report/report-submission/view-manager');
    this.hasPermissionApprove = this.router.url.includes('/report/report-submission/view-manager');
    let reportSubmissionId = this.route.snapshot.paramMap.get('reportSubmissionId');
    this.formSubmit.controls = { submitFile: new FileControl(), appendixFile: new FileControl(), templateFile: new FileControl(), importFile: new FileControl() };
    this.service.getDetailSubmissionId(reportSubmissionId)
      .subscribe(res => {
        this.status = res.status;
        this.submissionInfo = res;
        this.requestReportService.findOne(this.submissionInfo.requestReportingId)
        .subscribe(res => {
          Object.assign(this.submissionInfo,
              {nameAdReportTemplate: res.nameAdReportTemplate,
                      nameBusinessType: res.nameBusinessType,
                      adReportTemplateId: res.adReportTemplateId});
          if(res.isImportRequired == 1){
            this.isImportRequired = true
          }
          this.isApproveRequired = res.isApproveRequired;// cần xét duyệt
          this.reportingCriteria = res.reportingCriteria;
          this.formSubmit = this.buildForm('', this.buildFormConfig());
          this.hasTemplate = res.isSignRequired == ISSIGNREQUIRED;// cần ký duyệt
          if (res.isSignRequired == ISSIGNREQUIRED) {// cần ký duyệt
            if (res.isApproveRequired) {
              this.btnLabelCode = 'common.button.icon.saveAndSubmitApprove'
            } else {
              this.btnLabelCode = 'common.button.icon.saveAndSubmitVofficeNotApprove'
            }
          } else {
            this.btnLabelCode = 'common.button.icon.saveAndSubmitNotVoffice'
          }
          this.bindingReportSubmission();
          // danh sách dữ liệu import
          if(res.adReportTemplateId != null && this.isImportRequired == true){
            this.checkIsHasTemplate  = true;
            this.reportConfigService.findOne(res.adReportTemplateId).subscribe(res => {
              Object.assign(this.submissionInfo,{tableName: res.tableName != null ? res.tableName: res.lstParamSheet[0].tableName});
              if(( res.lstParamSheet != null && res.lstParamSheet.length > 1) ||
                  res.tableName === "ad_report_data_matrix" ||
                  (res.lstParamSheet != null && res.lstParamSheet.length == 1 && res.lstParamSheet[0].tableName === "ad_report_data_matrix") ||
                  res.tableName === "ad_report_multi_row" ||
                  (res.lstParamSheet != null && res.lstParamSheet.length == 1 && res.lstParamSheet[0].tableName === "ad_report_multi_row")){
                this.checkIsManySheet = true
                this.processSearchImport();
              }else{
                // dựng form động
                if(res.tableName === "ad_report_data_matrix" || (res.lstParamSheet != null && res.lstParamSheet[0].tableName === "ad_report_data_matrix")){
                  // cho dạng matrix
                  let listHeader = ["Tên đơn vị", "Tiêu chí dọc", "Tiêu chí ngang", "Giá trị"];
                  let listBody = ["organizationName","nameVertical", "nameHorizontal", "value"];
                  for(let i=0;i<listHeader.length;i++){
                    this.listHeader.push({
                      header: listHeader[i]
                    })
                    this.listBody.push({
                      body: listBody[i]
                    })
                  }
                }else if(res.tableName === "ad_report_multi_row" || (res.lstParamSheet != null && res.lstParamSheet[0].tableName === "ad_report_multi_row")){
                  let listHeader = ["Dòng số", "Vị trí", "Giá trị", "Số thứ tự sheet"];
                  let listBody = ["rowNo","columnNameExport", "value", "sheetNo"];
                  for(let i=0;i<listHeader.length;i++){
                    this.listHeader.push({
                      header: listHeader[i]
                    })
                    this.listBody.push({
                      body: listBody[i]
                    })
                  }
                }else{
                  // các dạng còn lại
                  for(let item in res.lstParam){
                    this.listHeader.push({
                      header: res.lstParam[item].name
                    })
                    let bodyKey = res.lstParam[item].code
                    if(res.tableName === "ad_report_data_one_row"){
                      bodyKey = res.lstParam[item].code.toLowerCase();
                    }
                    this.listBody.push({
                      body: bodyKey
                    })
                  }
                }
                this.count = this.listHeader.length + 1;
                this.tableFormConfig = {}
                this.checkListBodyBySearch = this.listBody
                for(let item in this.listBody){
                  this.tableFormConfig[this.listBody[item].body]= [null];
                }
                // fill data
                this.processSearchImport();
              }
            })
          }

        })
      })
    this.checkShowMoveFile = this.viewMode ? false : true;
  }

  /**
   * show value in table body
   * @param col
   * @param item
   */
  processShowValue(col, item){
    let str = '';
    if(item != null){
     str = item.get(col.body).value
    }
    return str;
  }

  filterDataTable(){
    this.keySearch = this.formSearchDataImport.controls['keyword'].value.toLowerCase();
    this.processSearchImport();
  }

  /**
   * get list data table
   * @param event
   */
  processSearchImport(event?){
    let data= {
      reportSubmissionId: this.submissionInfo.reportSubmissionId,
      nameTable: this.submissionInfo.tableName,
      keySearch: this.keySearch,
    }
    this.service.searchDataImport(data, event).subscribe(resImport =>{
      if(resImport.data.length > 0){
        const controls = new FormArray([]);
        for(const item in resImport.data){
          const formTableConfig = resImport.data[item];
          const group = this.buildForm({}, this.tableFormConfig);
          group.patchValue(formTableConfig);
          controls.push(group);
        }
        this.lstData = controls;
        this.resultList = resImport;
        this.listBody = this.checkListBodyBySearch;
        this.checkShowButtonExport = true;
      }else{
        this.lstData = new FormArray([this.buildForm({}, this.tableFormConfig)]);
        this.listBody = []
        this.checkShowButtonExport = false;
      }
    })
  }

  checkFileImport(){
    this.checkChangeFileImport = false
    this.checkShowButtonExport = false
  }

  changeFileImport(){
    if (this.formSubmit.get('importFile').value == null) {
      this.checkChangeFileImport = false
    }else{
      this.checkChangeFileImport = true
    }
  }

  previous() {
    this.router.navigateByUrl('/report/report-submission');
  }

  async onSaveOrSubmitted(isSaveAndSubmit: boolean = false) {
    if ((this.formSubmit.value.submitFile || !this.hasTemplate) && ((this.formSubmit.value.importFile && this.isImportRequired) || !this.isImportRequired)) {
      this.app.confirmMessage(null, async () => {
        const formSave = this.buildParam();
        const rest = await this.service.saveOrUpdateProcess(formSave).toPromise();
        if (rest.type == RESPONSE_TYPE.SUCCESS) {
          if (isSaveAndSubmit) {
            this.helperService.setWaitDisplayLoading(true);
            try {
              const submitReport = await this.service.submit(this.submissionInfo.reportSubmissionId).toPromise();
              this.helperService.setWaitDisplayLoading(false);
              const hasVoAndNoApprove = this.hasTemplate && !this.isApproveRequired;
              if (submitReport.type == RESPONSE_TYPE.SUCCESS && hasVoAndNoApprove) {
                const cloneFiles = await this.signDocumentService.cloneFile(submitReport.data.signDocumentId).toPromise();
                if (cloneFiles.type == RESPONSE_TYPE.SUCCESS) {
                  this.router.navigateByUrl(`/voffice-signing/report-submission/${submitReport.data.signDocumentId}`);
                } else {
                  this.router.navigate(['/report/report-submission']);
                }
              } else {
                this.router.navigate(['/report/report-submission']);
              }
            } finally {
              this.helperService.setWaitDisplayLoading(false);
            }
          } else {
            this.router.navigate(['/report/report-submission']);
          }
        }
      },() => { });
    } else {
      if(!this.formSubmit.value.importFile){
        this.app.errorMessage("error.fileImport","Bạn phải chọn File import dữ liệu!")
      }else{
        this.helperService.APP_TOAST_MESSAGE.next({ type: "ERROR", code: "file.template" });
      }
    }
  }

  async save() {
    await this.onSaveOrSubmitted();
  }

  async checkImportFile(){
    if (this.formSubmit.value.importFile){
      this.app.confirmMessage(null, async () => {
        const formSave = this.buildParam();
        const rest = await this.service.saveFileImportData(formSave).toPromise();
        if (rest.type === 'SUCCESS') {
          this.processSearchImport();
          this.checkShowButtonExport = true;
          this.dataError = null;
          this.app.successMessage('import.success')
        }else{
          // let content = "";
          // if(typeof rest.data === "object"){
          //   for(let item in rest.data){
          //     content += rest.data[item].description + ", ";
          //   }
          // }else{
          //   content += rest.data;
          // }
          if(typeof (rest.data) === 'string'){
            this.app.warningMessage(rest.code,rest.data);
          }else{
            this.dataError = rest.data;
          }
        }
      },() => { });
    }else{
      this.app.errorMessage("error.fileImport","Bạn phải chọn File import dữ liệu!")
    }
  }

  exportFileReport(){
    const formData = {
      reportSubmissionId : this.buildParam().reportSubmissionId ,
    }
    this.service.export(formData).subscribe(res=>{
      saveAs(res, 'export_du_lieu.xlsx')
    })
  }

  async saveAndSubmit() {
    await this.onSaveOrSubmitted(true);
  }

  buildFormConfig() {
    let fromConfig: any = {
      submitFile: ['', ValidationService.required],
      appendixFile: [''],
      templateFile: [''],
      importFile: ['', ValidationService.required],
    };
    for (let criteria of this.reportingCriteria) {
      fromConfig[criteria.requestReportingCriteriaId] = [null, ValidationService.required]
    }
    return fromConfig;
  }

  buildParam() {
    let param: any = {};
    param.reportSubmissionId = this.submissionInfo.reportSubmissionId;
    // list submitFile moi
    if (this.formSubmit.value.submitFile) {
      param.submitFiles = this.formSubmit.value.submitFile.filter(file => file.size > 0);
    }
    // list submitFile cu
    const listSubmitFile = this.formSubmit.controls['submitFile']['fileAttachment'];
    listSubmitFile.forEach((file) => {
      delete file['target'];
      if(file && file.attachmentFileId) {
        file.id = file.attachmentFileId;
      }
    })
    const listSubmitFileOld = listSubmitFile.filter((file) => file.id && file.id > 0)
    if (listSubmitFileOld) {
      param.listSubmitFileOld = listSubmitFileOld;
    }

    // list appendixFile moi
    if (this.formSubmit.value.appendixFile) {
      param.appendixFiles = this.formSubmit.value.appendixFile.filter(file => file.size > 0);
    }
    // list appendixFile cu
    const listAppendixFile = this.formSubmit.controls['appendixFile']['fileAttachment']
    listSubmitFile.forEach((file) => {
      if(file && file.attachmentFileId) {
        file.id = file.attachmentFileId;
      }
    })
    const listAppendixFileOld = listAppendixFile.filter((file) => file.id && file.id > 0)
    if (listAppendixFileOld) {
      param.listAppendixFileOld = listAppendixFileOld;
    }
    // list templateFile moi
    if (this.formSubmit.value.templateFile) {
      param.templateFile = this.formSubmit.value.templateFile.filter(file => file.size > 0);
    }
    // list templateFile cu
    const listTemplateFile = this.formSubmit.controls['templateFile']['fileAttachment']
    listTemplateFile.forEach((file) => {
      if(file && file.attachmentFileId) {
        file.id = file.attachmentFileId;
      }
    })
    const listTemplateFileOld = listTemplateFile.filter((file) => file.id && file.id > 0)
    if (listAppendixFileOld) {
      param.listTemplateFileOld = listTemplateFileOld;
    }
    let criterias = [];
    for (let key in this.formSubmit.value) {
      if (key != "submitFile" && key != "appendixFile" && key != "templateFile" && key != "importFile" ) {
        let criteria: any = {};
        criteria.requestReportingCriteriaId = key;
        criteria.criteriaValue = this.formSubmit.value[key];
        criterias.push(criteria);
      }
    }
    if (criterias.length > 0) {
      param.criterias = criterias;
    }
    if (this.formSubmit.value.importFile) {
      param.importFile = this.formSubmit.value.importFile;
    }
    return param;
  }

  async bindingReportSubmission() {
    // let res = await this.service.getDetailSubmissionId(this.submissionInfo.reportSubmissionId).toPromise()

    let criterias = this.submissionInfo.criterias;
    for (let criteria of criterias) {
      this.formSubmit.controls[criteria.requestReportingCriteriaId].setValue(criteria.criteriaValue);
    }

    if (this.submissionInfo.submitFiles) {
      let fileControl = new FileControl();
      fileControl.setFileAttachment(this.submissionInfo.submitFiles);
      this.formSubmit.setControl('submitFile', fileControl);
    }
    if (this.submissionInfo.appendixFiles) {
      let fileControl = new FileControl();
      fileControl.setFileAttachment(this.submissionInfo.appendixFiles);
      this.formSubmit.setControl('appendixFile', fileControl);
    }
    if (this.submissionInfo.templateFile) {
      let fileControl = new FileControl();
      fileControl.setFileAttachment(this.submissionInfo.templateFile);
      this.formSubmit.setControl('templateFile', fileControl);
    }
    if (this.submissionInfo.fileAttachment) {
      let fileControl = new FileControl();
      fileControl.setFileAttachment(this.submissionInfo.fileAttachment.fileImport);
      this.formSubmit.setControl('importFile', fileControl);
    }
  }

  approveReport() {
    this.app.confirmMessage("label.report.aprrove",
      () => {
        let param = {
          reportSubmissionId: this.submissionInfo.reportSubmissionId,
          status: DA_XET_DUYET
        }
        this.reportManagerService.updateStatusReport(param)
          .subscribe(res => {
            history.back();
          })
      },
      () => { }
    )
  }

  rejectReport() {
    const ref = this.dialogService.open(RejectFormComponent, {
      header: 'Nhập lý do từ chối',
      width: '50%',
      baseZIndex: 1500,
      contentStyle: {"padding": "0"},
      data: this.submissionInfo.reportSubmissionId
    });
    ref.onClose.subscribe( (isAdd) => {
      if (isAdd){
        history.back();
      }
    });
  }

  navigate() {
    this.router.navigate(['/report/report-submission', this.submissionInfo.reportSubmissionId]);
  }
}
