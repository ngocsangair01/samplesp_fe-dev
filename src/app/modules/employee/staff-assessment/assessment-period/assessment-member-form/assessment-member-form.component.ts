import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { FileControl } from '@app/core/models/file.control';
import { AppParamService } from '@app/core/services/app-param/app-param.service';
import { AssessmentFormulaService } from '@app/core/services/assessment-formula/assessment-formula.service';
import { AssessmentPeriodService } from '@app/core/services/assessmentPeriod/assessment-period.service';
import { CategoryService } from '@app/core/services/setting/category.service';
import { SettingIconService } from '@app/core/services/setting/setting-icon.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import {CommonUtils, CryptoService, ValidationService} from '@app/shared/services';
import { environment } from '@env/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslationService } from 'angular-l10n';
import { AssessmentPeriodCreatedList } from '../assessment-period-created-list/assessment-period-created-list.component';
import {
  CONFIG,
  DEFAULT_MODAL_OPTIONS,
  LARGE_MODAL_OPTIONS
} from './../../../../../core/app-config';
import _ from 'lodash';
import {AssessmentEmployeeService} from "@app/core/services/employee/assessment-employee.service";
import {
  AssessmentPeriodNewImportComponent
} from "@app/modules/employee/staff-assessment/assessment-period/assessment-period-import/assessment-period-new-import.component";
import {
  AssessmentPartyOrganizationImportComponent
} from "@app/modules/party/party-member/assessment-party-organization/assessment-party-organization-import/assessment-party-organization-import.component";
import {
  AssessmentPartyOrganizationNewImportComponent
} from "@app/modules/party/party-member/assessment-party-organization/assessment-party-organization-import/assessment-party-organization-new-import.component";
import {AssessmentPeriodModelComponent} from "@app/modules/employee/staff-assessment/assessment-period/assessment-member-form/assessment-member-model/assessment-period-model.component";
import {AssessmentResultService} from "@app/core/services/employee/assessment-result.service";
import {
  AssessmentSignatureComponent
} from "@app/modules/employee/staff-assessment/assessment-signature/assessment-signature.component";
import {
  AssessmentEvaluateEmployeeAgainComponent
} from "@app/modules/employee/staff-assessment/assessment/assessment-evaluate-employee-again/assessment-evaluate-employee-again.component";
import {AssessmentReportService} from "@app/core/services/assessment-party-organization/assessment-report.service";
import {
  VofficeSigningPreviewModalComponent
} from "@app/modules/voffice-signing/preview-modal/voffice-signing-preview-modal.component";
import {
  AssessmentEmployeeFormComponent
} from "@app/modules/employee/staff-assessment/assessment-period/assessment-employee-form/assessment-employee-form.component";
import { MessageService } from 'primeng/api';
import {el} from "@angular/platform-browser/testing/src/browser_util";
import { SignDocumentService } from '@app/core/services/sign-document/sign-document.service';
import {AssessmentHistoryLogComponent} from "@app/modules/employee/staff-assessment/assessment/assessment-history-log/assessment-history-log.component";
import {AssessmentHistoryLogComponent2} from "@app/modules/employee/staff-assessment/assessment/assessment-history-log2/assessment-history-log2.component";
import {SignPreviewFileModalComponent} from "@app/modules/employee/staff-assessment/assessment-period/assessment-member-form/preview-modal/sign-preview-file-modal.component";
import { AssessmentEmployeeLevelService } from '@app/core/services/assessment-employee-level/assessment-employee-level.service';
import { HrStorage } from '@app/core/services/HrStorage';
import { AssessmentMemberSignComponent } from './assessment-member-sign/assessment-member-sign.component';
@Component({
  selector: 'assessment-period-form',
  templateUrl: './assessment-member-form.component.html',
  styleUrls: ['./assessment-member-form.component.css']
})
export class AssessmentMemberFormComponent extends BaseComponent implements OnInit {
  public AVATAR_API_URL = environment.serverUrl['political'] + CONFIG.API_PATH['employee-image'] + '/';
  modalRefSignature: any
  modalRefReEvaluate: any
  modalRefHistory: any
  assessmentPeriodId: any;
  evaluateEmployeeData: any = {}
  optionAssessmentStatus: any;
  optionAssessmentSignStatus: any;
  formEmployee: FormGroup;
  formAssessmentLevel: FormGroup;
  isInsert: boolean = false;
  isEdit: boolean = false;
  isView: boolean = false;
  isMobileScreen: boolean = false;
  formEmployeeConfig={
    assessmentPeriodId: ['',[Validators.required]],
    assessmentPeriodName: [''],
    evaluatingStatus: [''],
    employeeId: [''],
    domain: ['1'],
    organizationId: [''],
    partyOrganizationId: ['',[Validators.required]],
    assessmentOrder: [''],
    signerId: [''],
    assessmentSignStatus: [''],
    isHasEvaluating: [''],
    isAssessmentPeriodId: [false],
    isEmployeeId: [false],
    isPartyOrganizationId: [false],
    isAssessmentOrder: [false],
    isEvaluatingStatus: [false],
    isSignerId: [false],
    isAssessmentSignStatus: [false],
    isCheckHasEvaluating: [false]
  }

  formAssessmentLevelConfig={
    assessmentPeriodId: [''],

  }
  assessmentPeriod: any;
  assessmentList: any;
  assessmentLevelList: any = {};
  assessmentEmployeeList: any = {};
  credentials: any = {};
  listSelected: any[] = [];
  currentEvent: any;
  result: any;
  evaluateEmployeeInfo: any;
  evaluateEmployeeInfoData: any;
  showSignAll: boolean = false;
  constructor(
      private categoryService: CategoryService,
      private router: Router,
      private actRou: ActivatedRoute,
      private app: AppComponent,
      private assessmentPeriodService: AssessmentPeriodService,
      private assessmentReport: AssessmentReportService,
      private assessmentEmployeeService: AssessmentEmployeeService,
      private assessmentEmployeeLevelService: AssessmentEmployeeLevelService,
      private assessmentResult: AssessmentResultService,
      private signDocumentService: SignDocumentService,
      private formBuilder: FormBuilder,
      private assessmentFormulaService: AssessmentFormulaService,
      private modalService: NgbModal,
      private settingIconService: SettingIconService,
      private appParamService: AppParamService,
      private messageService: MessageService,
      private translation: TranslationService,
      private assessmentResultService: AssessmentResultService
  ) {
    super(null, 'ASSESSMENT_PERIOD_ADMIN');
    this.setMainService(assessmentPeriodService);
    this.buildFormEmployee({}) // build form employee
    // this.formAssessmentLevel = this.buildForm([], this.formAssessmentLevelConfig);
    this.optionAssessmentStatus = [
      {label:"Chưa thực hiện", value: 0},
      {label:"Đang thực hiện", value: 1},
      {label:"Đã hoàn thành", value: 2}
    ];
    this.optionAssessmentSignStatus = [
      {label:"Dự Thảo", value: 0},
      {label:"Đang trình ký", value: 1},
      {label:"Từ chối ký duyệt", value: 2},
      {label:"Đã ký duyệt", value: 3},
      {label:"Đã Nộp", value: 4},
    ]
    this.assessmentPeriodService.getAssessmentPeriodList().subscribe(res => {
      this.assessmentList = res;
      if (this.assessmentList.length) {
        const assessmentPeriodId = this.assessmentList[0].assessmentPeriodId
        this.formEmployee.controls['assessmentPeriodId'].setValue(assessmentPeriodId)
        this.onChangeAssessmentPeriod(assessmentPeriodId)
        setTimeout(() => {
          this.processSearchEmployee()
        }, 200);
      }
    });
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
  }

  ngOnInit() {
    const subPaths = this.router.url.split('/');
    if (subPaths.length > 5) {
      this.isInsert = subPaths[5] === 'add';
      this.isEdit = subPaths[5] === 'edit';
      this.isView = subPaths[5] === 'view';
    }
  }

  get f() {
    return this.formEmployee.controls;
  }

  private buildFormEmployee(data: any): void {
    this.formEmployee = this.buildForm(data, this.formEmployeeConfig);
    //this.formEmployee.controls['assessmentPeriodId'].setValue(this.assessmentPeriodId)
    // this.formEmployee.get('employeeCode').valueChanges.subscribe(value => {
    //   this.processSearchTimeout();
    // });
  }
  /**
   * Search timeout employee assessment
   */
  public processSearchTimeout() {
    /* if (this.fnSearch) {
       clearTimeout(this.fnSearch);
     }
     this.fnSearch = setTimeout(() => {
       const paramsSearch = this.formEmployee.value;
       this.processSearchEmp(paramsSearch)

     }, 1000);*/
  }

  /**
   * show popup setup employee assessment
   */
  public setupEmployeeAssessment(employeeId, updateCB: boolean) {
    // Show popup
    const modalRef = this.modalService.open(AssessmentPeriodModelComponent, {windowClass:'dialog-xl slide-in-right', backdrop: 'static'});
    const data = {
      assessmentList: this.assessmentList,
      assessmentPeriodId: this.f['assessmentPeriodId'].value,
      employeeId: employeeId,
      type: 'edit',
      updateCB: updateCB
    }
    modalRef.componentInstance.setFormValue(this.propertyConfigs, data);
    modalRef.result.then((result) => {
      if (!result) {
        return;
      } else {
        this.processSearchEmployee()
      }
    });
  }
  public processSearchEmployee(event?) {``
    if(!CommonUtils.isValidForm(this.formEmployee)) {
      return;
    }
    const params = this.formEmployee ? this.formEmployee.value : null
    this.credentials = Object.assign({}, params)
    if (!event) { // nếu mà bấm nút tìm kiếm trên form
      if (this.dataTable) {
        this.dataTable.first = 0
      }
      this.listSelected = []
    }
    this.currentEvent = params; //lưu lại điều kiện search cũ

    const searchData = CommonUtils.convertData(this.credentials)
    if (event) {
      searchData._search = CryptoService.encrAesEcb(JSON.stringify(event));
    }
    const buildParams = CommonUtils.buildParams(searchData);
    this.assessmentPeriodService.getStaffMappingV2(buildParams).subscribe(res => {
      this.assessmentEmployeeList = this.canYouHavePermission(res);
      this.validSignAll();
    })
  }
  /**
   * #243: [BUG ID: 5193] ĐGĐV - Quản lý cán bộ đánh giá - user login không có trong danh sách người đánh giá tại cấp tương ứng nhưng vẫn được trình ký
   *
   Description Bug
   Step
   User 1 có đánh giá tại cấp Chi bộ cho Nhân viên A, Nhưng không được đánh giá ở cấp Đảng bộ
   Hoàn thành cấp đánh giá chi bộ => thực hiện nhập kq đánh giá cho cấp Đảng bộ
   Actual
   User 1 đang có thể check vào checkbox đẻe trình ký và trình ký thành công cho cáp đảng bộ
   Expect
   Đánh giá ở cấp nào thì chỉ được trình ký ở cấp đó. không được trình ký cấp khác
   * @param res
   * @returns
   */
  private canYouHavePermission(res: any) {
    const data = res.data;
    if (!data || data.length <= 0) {
      return res;
    }
    const userLoginId = HrStorage.getUserToken().userInfo.employeeId;
    data.forEach(item => {
      this.preBuildData(item, userLoginId);
    })
    return res;
  }
  private preBuildData(data, userLoginId) {
    const levelNameEmployeeList = data.levelNameEmployeeList || [];
    if (!levelNameEmployeeList.length) {
      return;
    }
    let maxEvaluatingLevel = data.maxEvaluatingLevel;
    if (levelNameEmployeeList.length === 1) {
      maxEvaluatingLevel = levelNameEmployeeList[0].assessmentOrder;
    } else {
      maxEvaluatingLevel = levelNameEmployeeList.reduce((accumulator, currentValue) => {
        const maxTemp = accumulator.assessmentOrder;
        return maxTemp > currentValue.assessmentOrder ? maxTemp : currentValue.assessmentOrder;
      });
    }
    const evaluateDoneLevel = data.evaluateDoneLevel > 0 ? data.evaluateDoneLevel : -1;
    const isDonePeriodEvaluated = maxEvaluatingLevel === data.evaluateDoneLevel;
    const nextEvaluateLevel = levelNameEmployeeList.find(ele => ele.assessmentOrder > evaluateDoneLevel);
    levelNameEmployeeList.forEach(ele => {
      if (isDonePeriodEvaluated || (evaluateDoneLevel !== -1 && ele.assessmentOrder <= evaluateDoneLevel)) {
        ele['statusEvaluate'] = "DONE";
      } else if (nextEvaluateLevel && ele.assessmentOrder === nextEvaluateLevel.assessmentOrder) {
        ele['statusEvaluate'] = "PROCESSING";
      } else {
        ele['statusEvaluate'] = "PENDING";
      }
      if (ele.assessmentOrder === data.evaluatingLevel) {
        data.userSign = {
          'signerCode': ele.signerCode,
          'signerName': ele.signerName,
          'signerEmail': ele.signerEmail,
          'signerId' : ele.signerId
        }
      }
    });
    if (data.assessmentResultStatus === 0 || data.assessmentResultStatus === 2) {
      data.canYouHavePermission = levelNameEmployeeList.some(el => el.employeeId === userLoginId && (nextEvaluateLevel && el.assessmentOrder === nextEvaluateLevel.assessmentOrder));
    } else {
      data.canYouHavePermission = false;
    }
  }
  public onSelectChange() {

  }
  private activeModel(data?: any) {
    const modalRef = this.modalService.open(AssessmentPeriodNewImportComponent, DEFAULT_MODAL_OPTIONS);
    if (data) {
      modalRef.componentInstance.setFormValue(this.formEmployeeConfig, data);
    }
  }

  public async processStaffImport(item) {
    // if(!CommonUtils.isValidForm(this.formEmployee)) {
    //   return;
    // }
    // if (!this.currentEvent || !this.currentEvent.assessmentPeriodId)  {
    //   const summary = this.translation.translate(`app.messageSummary`);
    //   const content = this.translation.translate(`assessmentPeriod.assessmentPeriodId.isEmpty`);
    //   this.messageService.add({severity: 'warn', summary: summary, detail: content});
    //   return;
    // }
    let temp = item.value;
    if(item.value.assessmentPeriodId) {
      await this.assessmentPeriodService.findOne(item.value.assessmentPeriodId || '').subscribe(res => {
        temp.assessmentPeriodName= res.data.assessmentPeriodName;
        this.activeModel(temp);
      })
    } else{
      this.activeModel(temp);
    }
  }
  public processCreateList() {
    if(!CommonUtils.isValidForm(this.formEmployee)) {
      return;
    }
    const modalRef = this.modalService.open(AssessmentPeriodCreatedList, DEFAULT_MODAL_OPTIONS);
    const data = {
      assessmentList: this.assessmentList,
      assessmentPeriodId: this.f['assessmentPeriodId'].value,
    }
    modalRef.componentInstance.setFormValue(this.propertyConfigs, data);
    modalRef.result.then((result) => {
      if (!result) {
        return;
      } else {
        this.processSearchEmployee()
      }
    });
  }
  public  processImportVotingResult(item) {
    const modalRef = this.modalService.open(AssessmentPartyOrganizationNewImportComponent, DEFAULT_MODAL_OPTIONS);
    modalRef.componentInstance.setFormValue(item.value.assessmentPeriodId, item.value.partyOrganizationId);
    modalRef.result.then((result) => {
      if (!result) {
        return;
      }
      else {
        this.processSearchEmployee();
      }
    });
  }
  deleteEmployee(item){
    this.app.confirmMessage('assessmentPeriod.deletesigleEmployeeMapping', () => { // accept
      this.assessmentPeriodService.processDeleteEmployeeMappingByEmpId(item.assessmentPeriodId, item.assessmentEmployeeId).subscribe(res =>{
        this.assessmentPeriodService.getStaffMappingV2(this.formEmployee.value).subscribe(res => {
          this.assessmentEmployeeList = res;
          this.assessmentEmployeeList = this.canYouHavePermission(res);
        })
      })
    }, ()=>{
      // reject
    })
  }

  deleteResult(item){
    this.app.confirmMessage('assessmentPeriod.deleteAssessmentResult', () => { // accept
      this.assessmentResult.deleteEmployeeId(item.employeeId, item.assessmentPeriodId).subscribe(res =>{
        this.assessmentPeriodService.getStaffMappingV2(this.formEmployee.value).subscribe(res => {
          this.assessmentEmployeeList = res;
          this.assessmentEmployeeList = this.canYouHavePermission(res);
        })
      })
    }, ()=>{
      // reject
    })
  }

  updateVoting(item){
    const url = this.router.serializeUrl(
        this.router.createUrlTree(['/assessment/detail/' + item.assessmentPeriodId + '/' + item.employeeCode])
    );
    window.open(url, '_blank');
    // this.router.navigate(['/assessment/detail/' + item.assessmentPeriodId + '/' + item.employeeCode]);
  }

  public signature(item) {
    this.modalRefSignature = this.modalService.open(AssessmentSignatureComponent, DEFAULT_MODAL_OPTIONS);
    this.modalRefSignature.componentInstance.setFormValue(item.assessmentResultId, item.assessmentPeriodId, item.employeeId);
    this.modalRefSignature.result.then((result) => {
      //this.prepareEvaluateEmployee(this.evaluateEmployeeInfo.employeeId);
      this.assessmentPeriodService.getStaffMappingV2(this.formEmployee.value).subscribe(res => {
        this.assessmentEmployeeList = res;
        this.assessmentEmployeeList = this.canYouHavePermission(res);
      })
    });
  }

  /**
   * assessment evaluate again
   */
  public processReEvaluateEmployee(item) {
    this.modalRefReEvaluate = this.modalService.open(AssessmentEvaluateEmployeeAgainComponent, DEFAULT_MODAL_OPTIONS)
    this.modalRefReEvaluate.componentInstance.isNewTheme = false;
    this.modalRefReEvaluate.componentInstance.setData({
      assessmentResultId: item.assessmentResultId,
      employeeId: item.employeeId,
      assessmentPeriodId: item.assessmentPeriodId,
      assessmentOrder: item.evaluatingLevel
    });
    this.modalRefReEvaluate.result.then((result) => {
      if (!result) {
        return;
      } else {
        this.assessmentPeriodService.getStaffMappingV2(this.formEmployee.value).subscribe(res => {
          this.assessmentEmployeeList = res;
          this.assessmentEmployeeList = this.canYouHavePermission(res);
        })
      }
    });
  }

  exportAssessmentResult(item) {
    const assessmentEmployeeForm = {
      assessmentPeriodId: this.assessmentPeriodId,
      employeeId: item.employeeId
    }
    this.assessmentReport.exportAssessmentResult(assessmentEmployeeForm).subscribe(res => {
      saveAs(res, 'KQDG_DC_'+item.employeeName+'.pdf');
    })
  }

  async showHistoryLog(item){
    const modalRef = this.modalService.open(AssessmentHistoryLogComponent2, DEFAULT_MODAL_OPTIONS);
    const data = {
      assessmentPeriodId: item.assessmentPeriodId,
      employeeId : item.employeeId,
      assessmentList: this.assessmentList
    }
    modalRef.componentInstance.setFormValue(data);
    modalRef.componentInstance.assessmentPeriodId = item.assessmentPeriodId;
  }



  /**
   * Chọn nhân viên fill ra dữ liệu
   */
  public onChangeEmployee(data) {
    this.showSignAll = false;
  }

  public onChangeAssessmentPeriod(data){
    this.showSignAll = false;
    let paramSearch = { assessmentPeriodId: data}
    this.assessmentPeriodService.getAssessmentLevelList(paramSearch).subscribe(res=>{
      this.assessmentLevelList = res;
    });
  }

  viewFileSign(signDocumentId){
    const modalRef = this.modalService.open(VofficeSigningPreviewModalComponent, LARGE_MODAL_OPTIONS);
    modalRef.componentInstance.id = signDocumentId;
  }

  /**
   * Action xem file trước khi trình ký
   * @param signDocumentId
   */
  previewFileSigning(signDocumentId) {
    const modalRef = this.modalService.open(VofficeSigningPreviewModalComponent, LARGE_MODAL_OPTIONS);
    modalRef.componentInstance.id = signDocumentId;
  }

  prepareCreateStaffAssessment() {
    if (this.formEmployee.value.assessmentPeriodId){
      const modalRef = this.modalService.open(AssessmentEmployeeFormComponent, DEFAULT_MODAL_OPTIONS);
      const data = {
        assessmentPeriodId: this.formEmployee.value.assessmentPeriodId,
        isPartyMemberAssessment: true
      }
      modalRef.componentInstance.setFormValue(data);
      modalRef.result.then((result) => {
        if (result) {
          this.assessmentPeriodService.getStaffMappingV2(this.formEmployee.value).subscribe(res => {
            this.assessmentEmployeeList = res;
            this.assessmentEmployeeList = this.canYouHavePermission(res);
          })
        }
      });
    }

  }
  isValidFormToSign() {
    const isValidAssessmentPeriodId = !CommonUtils.isNullOrEmpty(this.currentEvent.assessmentPeriodId)
    const isValidSignerId = !CommonUtils.isNullOrEmpty(this.currentEvent.signerId)
    const isValidAssessmentOrder = !CommonUtils.isNullOrEmpty(this.currentEvent.assessmentOrder)
    return isValidAssessmentPeriodId && isValidSignerId && isValidAssessmentOrder
  }
  public redictRouter(isSignAll = false) {
    if(!CommonUtils.isValidForm(this.formEmployee)) {
      return;
    }
    if (CommonUtils.isNullOrEmpty(this.currentEvent.signerId))  {
      const summary = this.translation.translate(`app.messageSummary`);
      const content = this.translation.translate(`assessmentPeriod.signerId.isEmpty`);
      this.messageService.add({severity: 'warn', summary: summary, detail: content});
      return;
    }
    if(CommonUtils.isNullOrEmpty(this.currentEvent.assessmentOrder)) {
      const summary = this.translation.translate(`app.messageSummary`);
      const content = this.translation.translate(`assessmentPeriod.assessmentOrder.isEmpty`);
      this.messageService.add({severity: 'warn', summary: summary, detail: content});
      return;
    }
    this.listSelected = this.listSelected || [];
    const listDataSign = this.listSelected.filter((item) => {
      return item.canYouHavePermission;
    });
    if (!isSignAll && (!listDataSign || listDataSign.length <= 0))  {
      const summary = this.translation.translate(`app.messageSummary`);
      const content = this.translation.translate(`assessmentPeriod.assessmentEmployeeLevel.isEmpty`);
      this.messageService.add({severity: 'warn', summary: summary, detail: content});
      return;
    }
    const queryParams = {};
    queryParams['assessmentPeriodId'] = this.currentEvent.assessmentPeriodId;
    queryParams['partyOrganizationId'] = this.f['partyOrganizationId'].value;
    queryParams['employeeId'] = this.currentEvent.signerId;
    queryParams['assessmentOrder'] = this.currentEvent.assessmentOrder;
    queryParams['isSignAll'] = 1;
    if (!isSignAll) {
      const listId = listDataSign.map(item => item.assessmentEmployeeLevelId); //fake dữ liệu
      queryParams['listId'] = listId;
      queryParams['isSignAll'] = 0;
    }
    this.router.navigate(['/sign-manager/multiple-sign'], { queryParams });
  }
  add(updateCB: boolean) {
    if(!CommonUtils.isValidForm(this.formEmployee)) {
      return;
    }
    const modalRef = this.modalService.open(AssessmentPeriodModelComponent, {windowClass:'dialog-xl slide-in-right', backdrop: 'static'});
    const data = {
      assessmentList: this.assessmentList,
      assessmentPeriodId: this.f['assessmentPeriodId'].value,
      employeeId: null,
      type:'add',
      updateCB: updateCB
    }
    modalRef.componentInstance.setFormValue(this.propertyConfigs, data);
    modalRef.result.then((result) => {
      if (!result) {
        return;
      } else {
        this.processSearchEmployee()
      }
    });
  }

  processExport() {
    if(!CommonUtils.isValidForm(this.formEmployee)) {
      return;
    }
    const credentials = Object.assign({}, this.formEmployee.value);
    const searchData = CommonUtils.convertData(credentials);
    const params = CommonUtils.buildParams(searchData);
    this.assessmentPeriodService.processExportEmployeeAssessment(params).subscribe(res => {
      saveAs(res, 'danh_sach_can_bo_danh_gia.xlsx');
    });
  }

  processExportV2() {
    if(!CommonUtils.isValidForm(this.formEmployee)) {
      return;
    }
    const credentials = Object.assign({}, this.formEmployee.value);
    const searchData = CommonUtils.convertData(credentials);
    const params = CommonUtils.buildParams(searchData);
    this.assessmentPeriodService.processExportEmployeeAssessmentV2(params).subscribe(res => {
      saveAs(res, 'danh_sach_can_bo_danh_gia.xlsx');
    });
  }

  preview(item) {
    // if (!this.validateBeforeSave()) {
    //   return;
    // }
    const modalRef = this.modalService.open(SignPreviewFileModalComponent, LARGE_MODAL_OPTIONS);
    modalRef.componentInstance.assessmentPeriodId = item.assessmentPeriodId;
    modalRef.componentInstance.employeeId = item.employeeId;
  }

  cancelSign(item: any) {
    this.app.confirmMessage('resolutionsMonth.cancelStream',
        () => {
          this.assessmentEmployeeLevelService.cancelSign('assessment-employee-level' ,item).subscribe(res => {
            this.app.successMessage('cancelSign.success');
            this.processSearchEmployee();
          })
        }, () =>  {
          // on rejected
        });
  };

  public handleSign(item) {
    if (CommonUtils.isNullOrEmpty(item.userSign.signerId))  {
      const summary = this.translation.translate(`app.messageSummary`);
      const content = this.translation.translate(`assessmentPeriod.signerId.isEmpty`);
      this.messageService.add({severity: 'warn', summary: summary, detail: content});
      return;
    }
    const listId = [];
    listId.push(item.assessmentEmployeeLevelId)
    this.router.navigate(['sign-manager/multiple-sign'], {
      queryParams: {
        listId: listId,
        employeeId: item.userSign.signerId,
        assessmentPeriodId: item.assessmentPeriodId,
        assessmentOrder: item.assessmentOrder
      },
    });
  }
  public updateVoffice(transCode) {
    this.signDocumentService.updateVoffice(transCode).subscribe(res => {
      if(this.appParamService.requestIsSuccess(res)) {
        this.app.successMessage('voffice.success');
        this.processSearchEmployee();
      }
    });
  }
  public signCB(item) {
    const modalRef = this.modalService.open(AssessmentMemberSignComponent, {windowClass:'dialog-xl slide-in-right', backdrop: 'static'});
    modalRef.componentInstance.setFormValue(item.value.assessmentPeriodId, item.value.partyOrganizationId);
    modalRef.result.then((result) => {
      if (!result) {
        return;
      }
      else {
        this.processSearchEmployee();
      }
    });
  }

  /**
   * Action Đồng bộ VO
   * @param item
   */
  syncSign(item: any) {
    this.signDocumentService.syncSign(item.transCode)
        .subscribe(res => {
          this.app.successMessage('voffice.success');
          this.processSearchEmployee();
        })
  }

  onChangeAssessmentOrder() {
    this.showSignAll = false;
  }

  validSignAll() {
    const tempCheck = this.f['assessmentPeriodId'].value && this.f['assessmentOrder'].value
        && this.f['signerId'].value;
    const exitsPermission = this.assessmentEmployeeList.data.some(item => item.canYouHavePermission);
    this.showSignAll = tempCheck && exitsPermission;
  }
  onTablePageChange(event) {
    const param = {first: 0, rows: event};
    this.changeRow = event;
    this.processSearchEmployee(param)
  }
}
