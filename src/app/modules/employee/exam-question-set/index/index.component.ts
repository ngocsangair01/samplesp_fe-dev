import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { RequestReportService } from '@app/core';
import { Router } from '@angular/router';
import { AppParamService } from '@app/core/services/app-param/app-param.service';
import { AppComponent } from '@app/app.component';
import { DialogService } from 'primeng/api';
import {ReportConfigService} from "@app/core/services/report/report-config.service";
import {FileStorageService} from "@app/core/services/file-storage.service";
import {CommonUtils} from "../../../../shared/services";
import { TranslationService } from 'angular-l10n';
import { ExamQuestionSetService } from '@app/core/services/thorough-content/exam-question-set.service';
import { FormControl, FormGroup } from '@angular/forms';
import { ThoroughContentService } from '@app/core/services/thorough-content/thorough-content.service';
@Component({
  selector: 'index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent extends BaseComponent implements OnInit {
  isHidden: boolean = false;
  isMasO: boolean = false;
  isPartyO: boolean = false;
  isOrg: boolean = false;
  rewardType: any;
  // branch: any;
  formConfig = {
    examQuestionId: [null],
    examQuestionSetId:[null],
    question: [null],
    type: [null],
    status: [null],
    branch: [null],
    title: [null],
    typeName: [null],
    statusName: [null],
    answer: [null],
    startDate: [null],
    endDate: [null],

    first: [0],
    limit: [10],
  }
  businessTypeOptions
  typeOfReportOptions;
  isMobileScreen: boolean = false;
  tableColumnsConfig = [
    {
      header: "common.label.table.action",
      width: "50px"
    },
    {
      header: "common.table.index",
      width: "50px"
    },
    {
      name: "title",
      header: "label.exam.question.set.test",
      width: "200px"
    },
    {
      name: "branchName",
      header: "label.exam.question.set.branch",
      width: "200px"
    },
    {
      name: "questionCount",
      header: "label.exam.question.set.query-count",
      width: "200px"
    },
    {
      name: "statusName",
      header: "label.exam.question.set.status",
      width: "150px"
    },
    {
      name: "createdDate",
      header: "label.exam.question.set.created-at",
      width: "200px"
    },
    {
      name: "fullName",
      header: "label.exam.question.set.created-by",
      width: "200px"
    },
  ]

  statusList = [
    { id: 1, name: this.translateService.translate('label.exam.question.set.status-1') },
    { id: 2, name: this.translateService.translate('label.exam.question.set.status-2') }
  ];

  branchNotUpdatableList = [];

  branchList = [{ value: 1, label: this.translateService.translate('label.thorough-content.branch-1'), disabled: false },
    { value: 2, label: this.translateService.translate('label.thorough-content.branch-2'), disabled: false },
    { value: 3, label: this.translateService.translate('label.thorough-content.branch-3'), disabled: false },
    { value: 4, label: this.translateService.translate('label.thorough-content.branch-4'), disabled: false },
    { value: 5, label: this.translateService.translate('label.thorough-content.branch-5'), disabled: false },
    { value: 6, label: this.translateService.translate('label.thorough-content.branch-6'), disabled: false },
    { value: 7, label: this.translateService.translate('label.thorough-content.branch-7'), disabled: false }];

  constructor(
    private router: Router,
    private appParamService: AppParamService,
    private requestReportService: RequestReportService,
    private app: AppComponent,
    public dialogService: DialogService,
    private service: ExamQuestionSetService,
    private thoroughContentService: ThoroughContentService,
    private fileStorage: FileStorageService,
    private translateService: TranslationService
  ) {
    super();
    this.setMainService(this.service);
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
  }

  ngOnInit() {
    this.formSearch = this.buildForm('', this.formConfig);
    this.getDropDownOptions();
    // this.search();
   this.search({first: 0, rows: 10});
  }

  getDropDownOptions() {
    this.thoroughContentService.getBranchList().subscribe(resBranch => {
      this.branchNotUpdatableList = [];
      this.branchList.forEach(item => {
        if (!resBranch.data.includes(item.value)) {
          item.disabled = true;

          this.branchNotUpdatableList.push(item.value);
        }
      });
    });

    this.appParamService.appParams("TYPE_OF_REPORT").subscribe(
      res => {
        this.typeOfReportOptions = res.data;
      }
    )

    this.requestReportService.getBusinessType().subscribe(
      res => {
        this.businessTypeOptions = res.data;
      }
    )
  }

  navigateToCreatePage(rowData?) {
    console.log(rowData);
    // rowData.modeView = 1;

    if(rowData != undefined && rowData.status == 2){
      this.app.warningMessage('','Bản ghi ở trạng thái Đã duyệt không được phép sửa !');
      return;
    }else{
      this.router.navigateByUrl('employee/exam-question-set/create-update', { state: rowData });
    }
    // this.router.navigateByUrl('employee/exam-question-set/create-update', { state: rowData });
  }

  navigateToViewPage(rowData?) {
    rowData.modeView = 1;
    this.router.navigateByUrl('employee/exam-question-set/create-update', { state: rowData });
  }

  // addExamQuestionSet(){
  //   this.router.navigateByUrl('/exam-question-set/add');
  // }

  clonePopup(rowData?){
    if (CommonUtils.nvl(rowData.adReportTemplateId) > 0) {
      this.app.confirmMessage("common.message.confirm.clone", () => {// on accepted
        this.service.clone(rowData.adReportTemplateId)
            .subscribe(res => {
              if (this.service.requestIsSuccess(res)) {
                this.search(null);
              }
            });
      }, () => {// on rejected
      });
    }
  }

  search(event?) {
    console.log('in event khi search', event);
    if(event){
      this.formSearch.value['first'] = event.first;
      this.formSearch.value['limit'] = event.rows;
    }
    // console.log('in form khi search', this.formSearch);
    // const copiedForm = this.cloneFormGroup(this.formSearch);
    
    // if(event){
    //   copiedForm.value['first'] = event.first;
    //   copiedForm['limit'] = event.rows;
    // }
    // console.log('data form search', copiedForm);
    // copiedForm.controls['branch'].setValue(this.formSearch.value.branch == undefined ? null : this.formSearch.value.branch.id);
    // copiedForm.controls['status'].setValue(this.formSearch.value.status == undefined ? null : this.formSearch.value.status.id);
    this.service.search(this.formSearch.value, event).subscribe(res => {
      this.resultList = res;
    });
  }

  deleteReport(report) {
    console.log('test data delete', report);
    if(report.status == 2){
      this.app.warningMessage('','Không xóa được bản ghi ở trạng thái Đã Duyệt!');
      return;
    }
    this.app.confirmDelete(null,
      () => {
        this.service.deleteById(report.examQuestionSetId)
          .subscribe(res => {
            this.search({first: 0, rows: this.formSearch.value.limit});
          })
      },
      () => { }
    )
  }

  public downloadFile(fileData) {
    if(fileData){
      this.fileStorage.downloadFile(fileData.secretId).subscribe(res => {
        saveAs(res, fileData.fileName);
      });
    }
  }

  cloneFormGroup(formGroup: FormGroup): FormGroup {
    const copiedControls = {};
    Object.keys(formGroup.controls).forEach(controlName => {
      const control = formGroup.controls[controlName];
      copiedControls[controlName] = new FormControl(control.value);
    });
    return new FormGroup(copiedControls);
  }


}
