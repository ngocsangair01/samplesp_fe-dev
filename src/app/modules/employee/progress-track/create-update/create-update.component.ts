import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import {
  ACTION_FORM, SMALL_MODAL_OPTIONS,
} from '@app/core';
import { AppComponent } from '@app/app.component';
import { DialogService } from 'primeng/api';
import { HelperService } from '@app/shared/services/helper.service';
import { Router } from '@angular/router';
import { TranslationService } from 'angular-l10n';
import { ThoroughContentService } from '@app/core/services/thorough-content/thorough-content.service';
import { ExamQuestionSetService } from '@app/core/services/thorough-content/exam-question-set.service';
import { EmpThoroughContentService } from '@app/core/services/thorough-content/emp-thorough-content.service';
import { HrStorage } from '@app/core/services/HrStorage';
import { formatPercent } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TestHistoryModaComponent } from './modal/test-history-modal.component';

@Component({
  selector: 'create-update',
  templateUrl: './create-update.component.html',
  styleUrls: ['./create-update.component.css']
})
export class CreateOrUpdateComponent extends BaseComponent implements OnInit {
  viewMode;
  formGroup: FormGroup;
  header = "Xem chi tiết tiến độ quán triệt";
  isCreate = false;
  isMobileScreen: boolean = false;
  formConfig = {
    thoroughContentId: [null],  // id văn bản quán triệt
    parentId: [null], // id quán triệt cấp trên
    title: [null, ValidationService.required], // tiêu đề
    branch: [null, ValidationService.required], // lĩnh vực
    issueLevel: [null, ValidationService.required], // cấp ban hành
    thoroughOrganizationId: [null, ValidationService.required], // đơn vị quán triệt
    organizationId: [null, ValidationService.required], // đơn vị được quán triệt
    formOfConfirmation: [null, ValidationService.required], // hình thức xác nhận
    typeThorough: [null, ValidationService.required], // đối tượng quán triệt
    thoroughDate: [null, [ValidationService.required, ValidationService.afterCurrentDate]], // ngày quán triệt
    endDate: [null, ValidationService.required], // hạn quán triệt
    targetTypeThorough: [null, ValidationService.required], // đối tượng quán triệt chính
    requiredThorough: [false], // yêu cầu quán triệt đơn vị
    examQuestionSetId: [null], // đề thi
    questionAmount: [null, [ValidationService.required, Validators.min(1)]], // số câu hỏi
    passScore: [null, [ValidationService.required, Validators.min(1)]],  // yêu cầu tối thiểu
    summaryContent: [null], // nội dung tóm tắt
    detailContent: [null],  // nội dung đầy đủ
    videoLink: [null],  // link video
    status: [{ id: 0, name: this.translation.translate('label.thorough-content.status-0') }, ValidationService.required], // trạng thái

    total: [null],
    confirmed: [null],
    notConfirmed: [null],

    isActive: [0],                               // có hiệu lực
  };

  formSearch: FormGroup;
  formSearchConfig = {
    thoroughContentId: [null],
    employee: [null],
    organizationId: [null],
    status: [null],

    first: [0],
    limit: [10],
  };

  tableColumnsConfig = [
    {
      header: "common.table.index",
      width: "50px"
    },
    {
      name: "employeeCode",
      header: "common.label.partymembersCode",
      width: "200px"
    },
    {
      name: "fullName",
      header: "common.label.employeeName",
      width: "200px"
    },
    {
      name: "partyOrganizationName",
      header: "common.label.unit",
      width: "200px"
    },
    {
      name: "statusName",
      header: "label.thorough-content.status",
      width: "150px"
    },
    {
      name: "readTime",
      header: "label.progress-track.completed-date",
      width: "150px"
    },
    {
      name: "testCount",
      header: "label.thorough-content.turn-number",
      width: "100px"
    },
    {
      name: "maxGrade",
      header: "label.progress-track.max-grade",
      width: "100px"
    },
  ];

  branchOptions = [{ id: 1, name: this.translation.translate('label.thorough-content.branch-1') },
    { id: 2, name: this.translation.translate('label.thorough-content.branch-2') },
    { id: 3, name: this.translation.translate('label.thorough-content.branch-3') },
    { id: 4, name: this.translation.translate('label.thorough-content.branch-4') },
    { id: 5, name: this.translation.translate('label.thorough-content.branch-5') },
    { id: 6, name: this.translation.translate('label.thorough-content.branch-6') },
    { id: 7, name: this.translation.translate('label.thorough-content.branch-7') }];

    typeThoroughOptions = [{ id: 1, name: this.translation.translate('label.thorough-content.type-thorough-1') },
    { id: 2, name: this.translation.translate('label.thorough-content.type-thorough-2') },
    { id: 3, name: this.translation.translate('label.thorough-content.type-thorough-3') },
    { id: 4, name: this.translation.translate('label.thorough-content.type-thorough-4') },
    { id: 5, name: this.translation.translate('label.thorough-content.type-thorough-5') },
    { id: 6, name: this.translation.translate('label.thorough-content.type-thorough-6') },
    { id: 8, name: this.translation.translate('label.thorough-content.type-thorough-8') },
    { id: 7, name: this.translation.translate('label.thorough-content.type-thorough-7') }];

  statusOptions = [{ id: 0, name: this.translation.translate('label.progress-track.status-0') },
    { id: 1, name: this.translation.translate('label.progress-track.status-1') }];

  issueLevelOptions = [{ id: 1, name: this.translation.translate('label.thorough-content.issue-level-1') },
    { id: 2, name: this.translation.translate('label.thorough-content.issue-level-2') },
    { id: 3, name: this.translation.translate('label.thorough-content.issue-level-3') }];

  formOfConfirmationOptions = [{ id: 1, name: this.translation.translate('label.thorough-content.form-of-confirmation-1') },
    { id: 2, name: this.translation.translate('label.thorough-content.form-of-confirmation-2') }];

  examQuestionSetOptions = [];

  emptyFilterMessage = this.translation.translate('selectFilter.emptyFilterMessage');

  userInfo = {employeeId: null};

  filterCondition = "AND obj.status = 1 AND obj.requiredThorough = 1 AND obj.typeThorough = 4 ORDER BY obj.created_date DESC";

  constructor(
    private app: AppComponent,
    public dialogService: DialogService,
    public helperService: HelperService,
    // private fileStorageService: FileStorageService,
    private router: Router,
    private service: ThoroughContentService,
    private examQuestionSetService: ExamQuestionSetService,
    private empThoroughContentService: EmpThoroughContentService,
    public translation: TranslationService,
    public modalService: NgbModal
  ) {
    super();
    this.setMainService(this.service);
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;

    this.userInfo = HrStorage.getUserToken().userInfo;
    this.filterCondition = `AND obj.status = 1 AND obj.required_thorough = 1 AND obj.type_thorough = 4
    AND EXISTS (SELECT 1 FROM party_organization po WHERE obj.organization_id = po.party_organization_id
      AND EXISTS (SELECT po2.org_path FROM party_member pm
        INNER JOIN party_member_process pmp ON pm.party_member_id = pmp.party_member_id
        INNER JOIN party_organization po2 ON pmp.party_organization_id = po2.party_organization_id
        WHERE ${this.userInfo.employeeId} = pm.employee_id
        AND po2.party_organization_id != po.party_organization_id
        AND po2.org_path LIKE CONCAT('%', po.party_organization_id,'%')
      )
    )
    ORDER BY obj.created_date DESC`;

    this.viewMode = true;

    this.formGroup = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW);
    this.formSearch = this.buildForm({}, this.formSearchConfig, ACTION_FORM.VIEW);

    this.examQuestionSetService.getListByDomain().subscribe(
      resQuestion => {
        this.examQuestionSetOptions = resQuestion.data;

        if (history.state.thoroughContentId) {
          this.service.findOne(history.state.thoroughContentId).subscribe(res => {
            this.formSearch.get('thoroughContentId').setValue(history.state.thoroughContentId);
            this.formSearch.get('organizationId').setValue(history.state.organizationId);
            res.data.status = this.statusOptions.find(e => { return e.id == res.data.status });

            res.data.branch = this.branchOptions.find(e => { return e.id == res.data.branch });
            res.data.issueLevel = this.issueLevelOptions.find(e => { return e.id == res.data.issueLevel });
            res.data.formOfConfirmation = this.formOfConfirmationOptions.find(e => { return e.id == res.data.formOfConfirmation });
            res.data.typeThorough = this.typeThoroughOptions.find(e => { return e.id == res.data.typeThorough });
            res.data.targetTypeThorough = this.typeThoroughOptions.find(e => { return e.id == res.data.targetTypeThorough });
            res.data.requiredThorough = res.data.requiredThorough == 1;
            res.data.examQuestionSetId = this.examQuestionSetOptions.find(e => { return e.examQuestionSetId == res.data.examQuestionSetId });
    
            res.data.total = history.state.total;
            var x = formatPercent(history.state.confirmed/history.state.total, 'en-US');
            res.data.confirmed = history.state.confirmed + "/" + history.state.total + " (" + x + ")";
            x = formatPercent(history.state.notConfirmed/history.state.total, 'en-US');
            res.data.notConfirmed = history.state.notConfirmed + "/" + history.state.total + " (" + x + ")";

            this.formGroup = this.buildForm(res.data, this.formConfig, ACTION_FORM.VIEW);

            this.search();
          });
        }
      }
    );
  }

  ngOnInit() {
  }

  previous() {
    this.router.navigateByUrl('/employee/progress-track');
  }

  get f() {
    return this.formGroup.controls;
  }

  cloneFormGroup(formGroup: FormGroup): FormGroup {
    const copiedControls = {};
    Object.keys(formGroup.controls).forEach(controlName => {
      const control = formGroup.controls[controlName];
      copiedControls[controlName] = new FormControl(control.value);
    });
    return new FormGroup(copiedControls);
  }

  search(event?) {
    if(event){
      this.formSearch.value['first'] = event.first;
      this.formSearch.value['limit'] = event.rows;
    }
    this.empThoroughContentService.search(this.formSearch.value, event).subscribe(res => {
      this.resultList = res;
    });
  }

  openTestHistoryPopup(rowData?) {
    if (rowData && rowData.testCount > 0) {
      this.examQuestionSetService.getEmpExamHistory(rowData.thoroughContentId, rowData.employeeId).subscribe(res => {
        const modalRef = this.modalService.open(TestHistoryModaComponent, SMALL_MODAL_OPTIONS);
        modalRef.componentInstance.setInitValue(res);
      });
    }
  }

  /**
   * Xuất danh sách
   */
  exportData() {
    const credentials = Object.assign({}, this.formSearch.value);
    const searchData = CommonUtils.convertData(credentials);
    const params = CommonUtils.buildParams(searchData);
    this.empThoroughContentService.export(params, 0).subscribe(res => {
      saveAs(res, 'Danh_sach_CBNV_quan_triet.xlsx');
    });
  }
}
