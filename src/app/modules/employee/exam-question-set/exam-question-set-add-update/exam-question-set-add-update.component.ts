import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import {
  ACTION_FORM, APP_CONSTANTS,
  DEFAULT_MODAL_OPTIONS,
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
import { TranslationService } from 'angular-l10n';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalExamQuestionComponent } from './modal-exam-question.component';
import { ExamQuestionSetService } from '@app/core/services/thorough-content/exam-question-set.service';
import { ExamQuestionImportComponent } from './file-import-exam-question/file-import-exam-question.component';
import { ThoroughContentService } from '@app/core/services/thorough-content/thorough-content.service';


@Component({
  selector: 'exam-question-set-add-update',
  templateUrl: './exam-question-set-add-update.component.html',
  styleUrls: ['./exam-question-set-add-update.component.css']
})
export class ExamQuestionSetAddUpdateComponent extends BaseComponent implements OnInit, AfterViewInit {
  viewMode;
  isMatrix: boolean = false;
  formGroup: FormGroup;
  formQuestionGroup: FormGroup;
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
  examQuestionSetId = null;

  formConfig = {
    title: [null, ValidationService.required],
    branch: [null, ValidationService.required],
    status: [{ id: 1, name: this.translateService.translate('label.exam.question.set.status-1') }],
    //Kiem soat rr
    listExamQuestion: [[]],
    examQuestionBeanList: [[]]
  }

  formQuestionConfig = {
    question: [null],
    type: [null],
    status: [null],
    listExamQuestionAnswer: [[]],
    examQuestionAnswerBeanList: [[]],
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

  statusList = [
    { id: 1, name: this.translateService.translate('label.exam.question.set.status-1') },
    { id: 2, name: this.translateService.translate('label.exam.question.set.status-2') }
  ];

  branchList = [{ value: 1, label: this.translateService.translate('label.thorough-content.branch-1'), disabled: false },
    { value: 2, label: this.translateService.translate('label.thorough-content.branch-2'), disabled: false },
    { value: 3, label: this.translateService.translate('label.thorough-content.branch-3'), disabled: false },
    { value: 4, label: this.translateService.translate('label.thorough-content.branch-4'), disabled: false },
    { value: 5, label: this.translateService.translate('label.thorough-content.branch-5'), disabled: false },
    { value: 6, label: this.translateService.translate('label.thorough-content.branch-6'), disabled: false },
    { value: 7, label: this.translateService.translate('label.thorough-content.branch-7'), disabled: false }];

  columnsExamQuestion: any[];
  selectedItems: any[] = [];
  isApproved = false;

  first = 0;
  rows = 5;
  rowOptions = [{label: 5}, {label: 10}, {label: 20}, {label: 50}];

  constructor(
    private requestReportService: RequestReportService,
    private appParamService: AppParamService,
    private app: AppComponent,
    public dialogService: DialogService,
    public helperService: HelperService,
    private dynamicApiService: DynamicApiService,
    private fileStorageService: FileStorageService,
    private router: Router,
    private service: ExamQuestionSetService,
    private thoroughContentService: ThoroughContentService,
    private translateService: TranslationService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
  ) {
    super();
    this.setMainService(this.service);
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;

    this.columnsExamQuestion = [
      { field: 'no', header: 'common.table.index', width: '50px', columnAlign: 'center', cssClass: 'vt-align-center' },
      { field: 'question', header: 'label.exam.question.question', sortable: 'question', width: '200px', cssClass: 'item-right'},
      { field: 'typeName', header: 'label.exam.question.type', sortable: 'typeName', width: '100px', cssClass: 'vt-align-right' },
      { field: 'answersName', header: 'label.exam.question.answer', sortable: 'answer', width: '300px', cssClass: 'vt-align-right' },
      { field: 'isCorrectName', header: 'label.exam.question.is-correct', sortable: 'answer', width: '75px', cssClass: 'vt-align-right' },
      { field: 'statusName', header: 'label.exam.question.status', sortable: 'statusName', width: '75px', cssClass: 'vt-align-right' }
    ];

    this.thoroughContentService.getBranchList().subscribe(resBranch => {
      this.branchList.forEach(item => {
        if (!resBranch.data.includes(item.value)) {
          item.disabled = true;
        }
      });
    })
  }

  ngAfterViewInit() {
    
  }

  ngOnInit() {
    this.formGroup = this.buildForm({}, this.formConfig, ACTION_FORM.INSERT);

    this.importTypeOptions = APP_CONSTANTS.IMPORT_TYPE;
    this.dataTypeOptions = APP_CONSTANTS.DATA_TYPE;
    const fileImportControl = new FileControl(null, ValidationService.required);
    const fileExportControl = new FileControl(null, ValidationService.required);
    this.viewMode = this.router.url == 'employee/exam-question-set/view';
    if (history.state.examQuestionSetId) {
      this.header = "Thông tin đề thi"
      this.viewMode = history.state.modeView;
      this.examQuestionSetId = history.state.examQuestionSetId;
      // this.helperService.setWaitDisplayLoading(true);
      this.service.findOne(history.state.examQuestionSetId).subscribe(res => {
        
        this.buildFormExamQuestionSet(res.data)
        this.initUpdate();
        this.reIndexList();
        // this.formGroup = this.buildForm(res, this.formConfig, ACTION_FORM.INSERT);

        console.log('data', this.formGroup);
      })
    }else{
      this.header = "Thông tin thêm mới";
      this.isCreate = true;
      
      this.formGroup = this.buildForm({}, this.formConfig, ACTION_FORM.INSERT);
      console.log('data', this.formGroup);
      // this.lstParam = new FormArray([this.makeDefaultFormTableConfig()])
      // this.buildFormTableConfig();
      // this.buildSheetFormConfig();
      // this.formGroup.addControl('fileImport', fileImportControl);
      // this.formGroup.addControl('exportFile', fileExportControl);
    }
  }


  previous() {
    this.router.navigateByUrl('employee/exam-question-set');
  }

  get f() {
    return this.formGroup.controls;
  }

  setValueInPDropDown(){
    this.formGroup.controls['businessType'].setValue(this.businessTypeOptions.find(e => { return e.parCode == this.formGroup.value.businessType }))
    // this.formGroup.controls['importType'].setValue(this.importTypeOptions.find(e => { return e.value == this.formGroup.value.importType }))
  }

  save(){
    if (!CommonUtils.isValidForm(this.formGroup)) {
      this.app.warningMessage('label.exam.question.require');
      return;
    }
    // this.formGroup.controls['importType'].setValue(this.formGroup.value.importType.value)
    console.log('test data', this.formGroup)
    const copiedForm = this.cloneFormGroup(this.formGroup);
    // copiedForm.controls['branch'].setValue(this.formGroup.value.branch == undefined ? null : this.formGroup.value.branch.id);
    copiedForm.controls['status'].setValue(this.formGroup.value.status == undefined ? null : this.formGroup.value.status.id);
    this.app.confirmMessage(null,
      () => {
        this.service.saveOrUpdate(copiedForm.value)
            .subscribe(res => {
              if(res.code == "success"){
                this.router.navigateByUrl('employee/exam-question-set');
              }
            })
        //this.setValueInPDropDown();
      },
      () => {
        //this.setValueInPDropDown();
      }
    )
  }

  approve(){
    if (!CommonUtils.isValidForm(this.formGroup)) {
      this.app.warningMessage('label.exam.question.require');
      return;
    }
    // this.formGroup.controls['importType'].setValue(this.formGroup.value.importType.value)
    console.log('test data', this.formGroup)
    const copiedForm = this.cloneFormGroup(this.formGroup);
    // copiedForm.controls['branch'].setValue(this.formGroup.value.branch == undefined ? null : this.formGroup.value.branch.id);
    copiedForm.controls['status'].setValue(2);
    this.app.confirmMessage(null,
      () => {
        this.service.saveOrUpdate(copiedForm.value)
            .subscribe(res => {
              if(res.code == "success"){
                this.router.navigateByUrl('employee/exam-question-set');
              }
            })
        //this.setValueInPDropDown();
      },
      () => {
        //this.setValueInPDropDown();
      }
    )
  }

  addExamQuestion() {
    const modalRef = this.modalService.open(ModalExamQuestionComponent, DEFAULT_MODAL_OPTIONS);
      modalRef.componentInstance.app = this.app;
      modalRef.componentInstance.setInitValue('insert');
      modalRef.result.then((item) => {
        console.log(item)
        if (item) {
          this.formGroup.get('listExamQuestion').value.push(item);
          item['no'] = this.formGroup.get('listExamQuestion').value.length;
        }
      });
  }

  deleteExamQuestion(){
    if(this.selectedItems.length < 1){
      this.app.warningMessage('label.exam.question.delete');
      return;
    }
    this.app.confirmDelete('label.exam.question.delete', () => {
      let indexRemove = [];
      this.selectedItems.map(item => indexRemove.push(item.no - 1));
      // on accepted
      let filteredList = this.formGroup.get('listExamQuestion').value.filter((_, index) => !indexRemove.includes(index));
      this.formGroup.get('listExamQuestion').setValue(filteredList);
      // this.selectedItems.map(item => this.formGroup.get('listExamQuestion').value.splice(item.no - 1, 1));
      // this.formGroup.get('listExamQuestion').value.splice(index, 1);
      this.reIndexList();
    }, () => {
      // on rejected
    });
  }

  cloneFormGroup(formGroup: FormGroup): FormGroup {
    const copiedControls = {};
    Object.keys(formGroup.controls).forEach(controlName => {
      const control = formGroup.controls[controlName];
      copiedControls[controlName] = new FormControl(control.value);
    });
    return new FormGroup(copiedControls);
  }

  buildFormExamQuestionSet(data) {
    this.formGroup = this.formBuilder.group({
        examQuestionSetId: [data.examQuestionSetId],
        // Hồ sơ rủi ro
        title: [data.title],
        branch: [data.branch],
        status: [data.status],
        examQuestionFormList: [data.examQuestionFormList],
        listExamQuestion: [data.examQuestionFormList],
    });
  }

  initUpdate(){
    // this.formGroup.get('branch').reset(this.getSelectedItem(this.branchList, 'id', this.formGroup.get('branch').value));
    this.formGroup.get('status').reset(this.getSelectedItem(this.statusList, 'id', this.formGroup.get('status').value));
  }

  updateAnswer(item, index) {
    const modalRef = this.modalService.open(ModalExamQuestionComponent, DEFAULT_MODAL_OPTIONS);
    console.log('data item', item);
    console.log('data index', index);
    this.buildFormExamQuestion(item);
    modalRef.componentInstance.app = this.app;
    modalRef.componentInstance.setInitValue('update', {
      form: this.formQuestionGroup
    });
    modalRef.result.then((item) => {
      if (item) {
        this.formGroup.get('listExamQuestion').value[index] = item;
      }
    });
  }

  viewAnswer(item, index) {
    const modalRef = this.modalService.open(ModalExamQuestionComponent, DEFAULT_MODAL_OPTIONS);
    console.log('data item', item);
    console.log('data index', index);
    this.buildFormExamQuestion(item);
    modalRef.componentInstance.app = this.app;
    modalRef.componentInstance.setInitValue('view', {
      form: this.formQuestionGroup
    });
    modalRef.result.then((item) => {
      if (item) {
        this.formGroup.get('listExamQuestion').value[index] = item;
      }
    });
  }

  deleteAnswer(item, index) {
    
    this.app.confirmDelete('app.qlrr.risk-management.delete', () => {
      console.log('gia tri', item);
      console.log('chi so index', index);
      // on accepted
      this.formGroup.get('listExamQuestion').value.splice(index, 1);
      this.reIndexList();
    }, () => {
      // on rejected
    });
  }

  buildFormExamQuestion(data) {
    this.formQuestionGroup = this.formBuilder.group({
        examQuestionId: [data.examQuestionId],
        // Hồ sơ rủi ro
        question: [data.question],
        type: [data.type],
        status: [data.status],
        answers: [data.examQuestionAnswerBeanList],
        listExamQuestionAnswer: [data.examQuestionAnswerBeanList],
        examQuestionAnswerBeanList: [data.examQuestionAnswerBeanList],
    });
  }

  navigate() {
    this.router.navigateByUrl('employee/exam-question-set/exam-question-set-add-update', { state: this.formGroup.value });
  }

  getSelectedItem(items, key, value) {
    if (value != undefined && value != null && items != null && items != undefined ) {
      for (let i = 0; i < items.length; i++) {
        if (value == items[i][key]) {
          return items[i];
        }
      }
    } else {
      return null;
    }
  }

  reIndexList() {
    if (this.formGroup.get('listExamQuestion').value != undefined) {
      let counter = 1;
      for (let i = 0; i < this.formGroup.get('listExamQuestion').value.length; i++) {
        this.formGroup.get('listExamQuestion').value[i]['no'] = counter;
        counter = counter + 1;
      }
    }
  }

  public openFormImport() {
    const modalRef = this.modalService.open(ExamQuestionImportComponent, DEFAULT_MODAL_OPTIONS);
    modalRef.componentInstance.setInitValue(history.state);
    modalRef.componentInstance.app = this.app;
    const data = { };
    // modalRef.componentInstance.setFormValue(this.propertyConfigs, data);
    modalRef.result.then((result) => {
      this.service.findOne(history.state.examQuestionSetId).subscribe(res => {
        
        this.buildFormExamQuestionSet(res.data)
        this.initUpdate();
        this.reIndexList();
        // this.formGroup = this.buildForm(res, this.formConfig, ACTION_FORM.INSERT);

        console.log('data', this.formGroup);
      })
      if (!result) {
        return;
      }
    });
  }

  pageChange(event) {
    this.first = event.first;
    this.rows = event.rows;
  }

  onChangeOption(event) {
    this.rows = event.value.label;
  }
}
