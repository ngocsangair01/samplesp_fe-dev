import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import {
  ACTION_FORM, APP_CONSTANTS,
  DynamicApiService,
  RequestReportService,
} from '@app/core';
import { AppParamService } from '@app/core/services/app-param/app-param.service';
import { AppComponent } from '@app/app.component';
import { DialogService } from 'primeng/api';
import { HelperService } from '@app/shared/services/helper.service';
import { FileStorageService } from '@app/core/services/file-storage.service';
import { FileControl } from '@app/core/models/file.control';
import { Router } from '@angular/router';
import {ReportConfigService} from "@app/core/services/report/report-config.service";

@Component({
  selector: 'create-update',
  templateUrl: './create-update.component.html',
  styleUrls: ['./create-update.component.css']
})
export class CreateOrUpdateComponent extends BaseComponent implements OnInit, AfterViewInit {
  viewMode;
  isMatrix: boolean = false;
  formGroup: FormGroup;
  lstParam: FormArray;
  lstParamSheet: FormArray;
  businessTypeOptions;
  importTypeOptions;
  dataTypeOptions;
  sheetNoOptions: any;
  header;
  disable;
  isMasO: boolean = false;
  isPartyO: boolean = false;
  isOrg: boolean = false;
  branch: any;
  rewardType: any;
  firstRowIndex = 0;
  pageSize = 10;
  firstRowIndexSheet = 0;
  pageSizeSheet = 10;
  isCreate = false;
  isMobileScreen: boolean = false;
  formConfig = {
    fix: [null],
    name: [null, ValidationService.required],     //tên biểu mẫu
    code: [null, ValidationService.required],     //mã biểu mẫu
    adReportTemplateId: [null],                   // id cấu hình biểu mẫu báo cáo
    businessType: [null, ValidationService.required],     // lĩnh vực
    validFromDate: [null, ValidationService.required],    // hiệu lực từ ngày
    validToDate: [null],                                  // hiệu lực đến ngày
    description: [null],                            // mô tả
    // tableName: [null, ValidationService.required],  // bảng lưu dữ liệu cho biểu mẫu báo cáo
    // importType: [null, ValidationService.required],                         // dạng import ma trận hay không
    isActive: [0],                               // có hiệu lực
    lstParam: [null],
    lstParamSheet: [null],
  }

  tableFormConfig = {
    adReportTemplateColumnId: [null],             // id
    adReportTemplateId: [null],                    // id bảng cha
    seqNo: [null, [ValidationService.required, ValidationService.integer]],    // thứ tự hiển thị
    code: [null, ValidationService.required],     // mã chỉ tiêu
    name: [null, ValidationService.required],     // tên chỉ tiêu
    dataType: [null, ValidationService.required], // kiểu dữ liệu
    columnName: [null, ValidationService.required],   // tên cột dữ liệu
    isActive: [0],                               // có hiệu lực
    isSearch: [0],                               // có tìm kiếm
    nameHorizontal: [null],                    // tên chỉ tiêu theo chiều ngang
    sheetNo: [null, ValidationService.required]
  }

  sheetFormConfig = {
    adReportTemplateSheetId: [null],
    adReportTemplateId: [null],
    seqNo: [null, [ValidationService.required]],
    name: [null, ValidationService.required],
    importType: [null, ValidationService.required],
    tableName: [null, ValidationService.required],
    isMatrix: [false],
  }
  constructor(
    private requestReportService: RequestReportService,
    private appParamService: AppParamService,
    private app: AppComponent,
    public dialogService: DialogService,
    public helperService: HelperService,
    private dynamicApiService: DynamicApiService,
    private fileStorageService: FileStorageService,
    private router: Router,
    private service: ReportConfigService,
  ) {
    super();
    this.setMainService(this.service);
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
  }

  ngAfterViewInit() {
    this.service.findOne(history.state.adReportTemplateId).subscribe(res => {
      // res.businessType = this.businessTypeOptions.find(e => { return e.parCode == res.businessType });
      // res.importType = this.importTypeOptions.find(e => {return e.value == res.importType})
      // this.formGroup = this.buildForm(res, this.formConfig, ACTION_FORM.INSERT);
      // if(res && res.fileAttachment){
      //   fileImportControl.setFileAttachment(res.fileAttachment.fileImport)
      //   fileExportControl.setFileAttachment(res.fileAttachment.exportFile)
      // }
      // this.formGroup.addControl('fileImport', fileImportControl);
      // this.formGroup.addControl('exportFile', fileExportControl);
      // this.lstParam = new FormArray([this.makeDefaultFormTableConfig()])
      this.buildFormTableConfig(res.lstParam);
      this.buildSheetFormConfig(res.lstParamSheet)
      // this.helperService.setWaitDisplayLoading(false);
    })
  }

  ngOnInit() {
    this.requestReportService.getBusinessType().subscribe(
        res => {
          this.businessTypeOptions = res.data;
        }
    )
    this.importTypeOptions = APP_CONSTANTS.IMPORT_TYPE;
    this.dataTypeOptions = APP_CONSTANTS.DATA_TYPE;
    const fileImportControl = new FileControl(null, ValidationService.required);
    const fileExportControl = new FileControl(null, ValidationService.required);
    this.viewMode = this.router.url == '/report/report-config/view';
    if (history.state.adReportTemplateId) {
      this.header = "Thông tin biểu mẫu"
      // this.helperService.setWaitDisplayLoading(true);
      this.service.findOne(history.state.adReportTemplateId).subscribe(res => {
        res.businessType = this.businessTypeOptions.find(e => { return e.parCode == res.businessType });
        // res.importType = this.importTypeOptions.find(e => {return e.value == res.importType})
        this.formGroup = this.buildForm(res, this.formConfig, ACTION_FORM.INSERT);
        if(res && res.fileAttachment){
          fileImportControl.setFileAttachment(res.fileAttachment.fileImport)
          fileExportControl.setFileAttachment(res.fileAttachment.exportFile)
        }
        this.formGroup.addControl('fileImport', fileImportControl);
        this.formGroup.addControl('exportFile', fileExportControl);
        this.lstParam = new FormArray([this.makeDefaultFormTableConfig()])
        this.lstParamSheet = new FormArray([this.makeDefaultSheetFormConfig()])
        this.addInSheetOptions()
        // this.buildFormTableConfig(res.lstParam);
        // this.helperService.setWaitDisplayLoading(false);
      })
    }else{
      this.header = "Thông tin thêm mới";
      this.isCreate = true;
      if (this.businessTypeOptions && this.businessTypeOptions.length > 0) {
        this.formGroup.controls['businessType'].setValue(this.businessTypeOptions[0]);
      }
      this.formGroup = this.buildForm({}, this.formConfig, ACTION_FORM.INSERT);
      // this.lstParam = new FormArray([this.makeDefaultFormTableConfig()])
      this.buildFormTableConfig();
      this.buildSheetFormConfig();
      this.formGroup.addControl('fileImport', fileImportControl);
      this.formGroup.addControl('exportFile', fileExportControl);
    }
  }

  private makeDefaultFormTableConfig(): FormGroup {
    let seqNo = 1
    if(this.lstParam){
      if(this.lstParam.length>0){
        seqNo = this.lstParam.length+1
      }
    }
    const formTableConfig = this.buildForm({seqNo: seqNo}, this.tableFormConfig);
    return formTableConfig;
  }

  private makeDefaultSheetFormConfig(): FormGroup {
    const sheetFormConfig = this.buildForm({}, this.sheetFormConfig);
    return sheetFormConfig;
  }

  public addRow(index: number, item: FormGroup) {
    const controls = this.lstParam as FormArray;
    controls.insert(index + 1, this.makeDefaultFormTableConfig());
    const maxPage = Math.ceil(this.lstParam.controls.length / this.pageSize);
    this.firstRowIndex = (maxPage - 1) * this.pageSize;
  }

  public removeRow(index: number, item: FormGroup) {
    const controls = this.lstParam as FormArray;
    if (controls.length === 1) {
      this.buildFormTableConfig();
      const group = this.makeDefaultFormTableConfig();
      controls.push(group);
      this.lstParam = controls;
    }
    controls.removeAt(index);
  }

  public addRowSheet(index: number, item: FormGroup) {
    const controls = this.lstParamSheet as FormArray;
    controls.insert(index + 1, this.makeDefaultSheetFormConfig());
    const maxPage = Math.ceil(this.lstParamSheet.controls.length / this.pageSizeSheet);
    this.firstRowIndexSheet = (maxPage - 1) * this.pageSizeSheet;
    this.addInSheetOptions()
  }

  public removeRowSheet(index: number, item: FormGroup) {
    const controls = this.lstParamSheet as FormArray;
    if (controls.length === 1) {
      this.buildSheetFormConfig();
      const group = this.makeDefaultSheetFormConfig();
      controls.push(group);
      this.lstParamSheet = controls;
    }
    controls.removeAt(index);
    this.addInSheetOptions()
  }

  addInSheetOptions(){
    this.sheetNoOptions = []
    for(let i=0; i< this.lstParamSheet.length; i++){
      const obj = {
        value: i+1,
        name: this.lstParamSheet.value[i].name
      };
      this.sheetNoOptions.push(obj);
    }
  }

  private buildFormTableConfig(list?: any) {
    if (!list || list.length == 0) {
      this.lstParam = new FormArray([this.makeDefaultFormTableConfig()]);
    } else {
      const controls = new FormArray([]);
      for (const i in list) {
        const formTableConfig = list[i];
        const group = this.makeDefaultFormTableConfig();
        group.patchValue(formTableConfig);
        controls.push(group);
      }
      this.lstParam = controls;
    }
  }

  private buildSheetFormConfig(list?: any) {
    if (!list || list.length == 0) {
      this.lstParamSheet = new FormArray([this.makeDefaultSheetFormConfig()]);
    } else {
      const controls = new FormArray([]);
      for (const i in list) {
        const formTableConfig = list[i];
        const group = this.makeDefaultSheetFormConfig();
        if(formTableConfig.importType === "matrix" || formTableConfig.importType === "1_row"){
          formTableConfig.isMatrix = true
        }else{
          formTableConfig.isMatrix = false
        }
        group.patchValue(formTableConfig);
        controls.push(group);
      }
      this.lstParamSheet = controls;
      this.addInSheetOptions()
    }
  }

  previous() {
    this.router.navigateByUrl('/report/report-config');
  }

  get f() {
    return this.formGroup.controls;
  }

  setValueInPDropDown(){
    this.formGroup.controls['businessType'].setValue(this.businessTypeOptions.find(e => { return e.parCode == this.formGroup.value.businessType }))
    // this.formGroup.controls['importType'].setValue(this.importTypeOptions.find(e => { return e.value == this.formGroup.value.importType }))
  }

  save(){
    let isCheck = false
    if(this.lstParam.value[0].name == null || this.lstParam.value[0].code == null
    || this.lstParam.value[0].dataType == null || this.lstParam.value[0].columnName == null || this.lstParam.value[0].sheetNo == null){
      this.app.warningMessage("inValidAllTab","Hãy nhập danh sách trường dữ liệu!");
      isCheck = true
    }
    if(this.lstParamSheet.length >0){
      for(let i=0;i<this.lstParamSheet.length;i++){
        this.lstParamSheet.value[i].seqNo = i+1
      }
    }
    if(this.lstParamSheet.value[0].name == null || this.lstParamSheet.value[0].seqNo == null
        || this.lstParamSheet.value[0].importType == null || this.lstParamSheet.value[0].tableName == null){
      this.app.warningMessage("inValidAllTab","Hãy nhập danh sheet dữ liệu!");
      isCheck = true
    }
    if (!CommonUtils.isValidForm(this.formGroup) || isCheck) {
      return;
    }
    this.formGroup.controls['lstParam'].setValue(this.lstParam.value)
    this.formGroup.controls['lstParamSheet'].setValue(this.lstParamSheet.value)
    this.formGroup.controls['businessType'].setValue(this.formGroup.value.businessType.parCode)
    // this.formGroup.controls['importType'].setValue(this.formGroup.value.importType.value)
    this.app.confirmMessage(null,
      () => {
        this.service.saveOrUpdateFormFile(this.formGroup.value)
            .subscribe(res => {
              if(res.code == "success" && history.state.adReportTemplateId){
                this.router.navigateByUrl('/report/report-config/view', { state: this.formGroup.value });
              }else if(res.code == "success"){
                this.router.navigateByUrl('/report/report-config');
              }
            })
        this.setValueInPDropDown();
      },
      () => {
        this.setValueInPDropDown();
      }
    )
  }

  // default tên bảng dữ liệu khi chọn ma trận
  changeImportType(index: number, item: FormGroup){
    const controls = this.lstParamSheet as FormArray;
    if(item.value.importType === "matrix"){
      controls.controls[index].patchValue({
        tableName : "ad_report_data_matrix",
        isMatrix : true
      })
    }else if(item.value.importType === "1_row"){
      controls.controls[index].patchValue({
        tableName : "ad_report_data_one_row",
        isMatrix : true
      })
    }else if(item.value.importType === "multi_row"){
      controls.controls[index].patchValue({
        tableName : "ad_report_multi_row",
        isMatrix : true
      })
    }else{
      controls.controls[index].patchValue({
        isMatrix : false
      })
    }
  }

  navigate() {
    this.router.navigateByUrl('/report/report-config/create-update', { state: this.formGroup.value });
  }
}
