import { AssessmentPeriodService } from './../../../../../core/services/assessmentPeriod/assessment-period.service';
import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '@env/environment';
import { CONFIG, DEFAULT_MODAL_OPTIONS } from '@app/core/app-config';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { AssessmentEmployeeMappingComponent } from '../assessment-employee-mapping/assessment-employee-mapping.component';
import { AppComponent } from '@app/app.component';
import { AssessmentResultService } from '@app/core/services/employee/assessment-result.service';
import { AssessmentSignatureComponent } from '../../assessment-signature/assessment-signature.component';
import { AssessmentEvaluateEmployeeAgainComponent } from '../../assessment/assessment-evaluate-employee-again/assessment-evaluate-employee-again.component';
import { AssessmentReportService } from '@app/core/services/assessment-party-organization/assessment-report.service';

@Component({
  selector: 'assessment-period-staff-list',
  templateUrl: './assessment-period-staff-list.component.html',
  styleUrls: ['./assessment-period-staff-list.component.css']
})
export class AssessmentPeriodStaffListComponent extends BaseComponent implements OnInit {
  public AVATAR_API_URL = environment.serverUrl['political'] + CONFIG.API_PATH['employee-image'] +   '/';
  assessmentPeriodId: number
  assessmentPeriodName: string
  formSearch: FormGroup
  modalRefSignature: any
  modalRefReEvaluate: any
  credentials: any
  formConfig={
    assessmentPeriodId: [''],
    assessmentPeriodName: [''],
    employeeCode: ['', [ValidationService.maxLength(100)]],
    employeeName: ['', [ValidationService.maxLength(200)]],
    employeePositionName: ['', [ValidationService.maxLength(200)]],
    domain: ['1'],
    organizationId: [null],
    evaluatingLevelFullName: [''],
    partyOrganizationId: ['']

  }
  constructor(
    public activeModal: NgbActiveModal,
    private assessmentPeriodService: AssessmentPeriodService,
    private modalService: NgbModal,
    private app: AppComponent,
    private assessmentResult: AssessmentResultService,
    private assessmentReport: AssessmentReportService
  ) {
    super(null, 'ASSESSMENT_PERIOD')
    this.setMainService(this.assessmentPeriodService)
    this.formSearch = this.buildForm({}, this.formConfig);
  }

  ngOnInit() {
    // this.processSearch(null)
  }

  setDataList(assessmentPeriod) {
    this.assessmentPeriodId = assessmentPeriod.assessmentPeriodId
    this.assessmentPeriodName = assessmentPeriod.assessmentPeriodName
    this.processSearchWithDomain(null)
  }

  get f() {
    return this.formSearch.controls;
  }

  public processSearchWithDomain(event?): void {
    this.formSearch.controls['assessmentPeriodId'].setValue(this.assessmentPeriodId)
    const params = this.formSearch ? this.formSearch.value : null
    this.credentials = Object.assign({}, params)
    if (!event) {
      if (this.dataTable) {
        this.dataTable.first = 0
      }
    }
    const searchData = CommonUtils.convertData(this.credentials)
    if (event) {
      searchData._search = event
    }
    const buildParams = CommonUtils.buildParams(searchData);
    this.assessmentPeriodService.getStaffMapping(buildParams).subscribe(res => {
      this.resultList = res
    })
  }

  processExport() {
    this.formSearch.controls['assessmentPeriodName'].setValue(this.assessmentPeriodName)
    const credentials = Object.assign({}, this.formSearch.value);
    const searchData = CommonUtils.convertData(credentials);
    const params = CommonUtils.buildParams(searchData);
    this.assessmentPeriodService.processExportEmployeeAssessment(params).subscribe(res => {
      saveAs(res, 'danh_sach_can_bo_danh_gia.xlsx');
    });
  }

  processExportRs() {
    this.formSearch.controls['assessmentPeriodName'].setValue(this.assessmentPeriodName)
    const credentials = Object.assign({}, this.formSearch.value);
    const searchData = CommonUtils.convertData(credentials);
    const params = CommonUtils.buildParams(searchData);
    this.assessmentPeriodService.processExportEmployeeAssessmentRs(params).subscribe(res => {
      saveAs(res, 'danh_sach_can_bo_danh_gia.xlsx');
    });
  }

  /**
   * show popup setup employee assessment
   */
  public setupEmployeeAssessment(employeeId) {
    // Show popup
    let dataRequest = {
      assessmentPeriodId: this.assessmentPeriodId,
      employeeId: employeeId
    }
    const modalRef = this.modalService.open(AssessmentEmployeeMappingComponent, DEFAULT_MODAL_OPTIONS);
    modalRef.componentInstance.setDataList(dataRequest)
    modalRef.result.then((result) => {
      if (!result) {
        return;
      }
      else{
        this.processSearchWithDomain(null);
      }
    });
  }

  deleteResult(item){
    this.app.confirmMessage('assessmentPeriod.deleteAssessmentResult', () => { // accept
      this.assessmentResult.deleteEmployeeId(item.employeeId, item.assessmentPeriodId).subscribe(res =>{
        this.processSearchWithDomain(null);
      })
    }, ()=>{
      // reject
    })
  }

  exportAssessmentResult(item) {
    const assessmentEmployeeForm = {
      assessmentPeriodId: this.assessmentPeriodId,
      employeeId: item.employeeId
    }
    this.assessmentReport.exportAssessmentResultV1(assessmentEmployeeForm).subscribe(res => {
      saveAs(res, 'KQDG_DC_'+item.employeeName+'.pdf');
    })
  }

  exportFileSign(item){
    const assessmentEmployeeForm ={
      employeeId: item.employeeId,
      assessmentPeriodId: this.assessmentPeriodId
    }
    this.assessmentResult.exportAssessmentResultFromVoffice(assessmentEmployeeForm).subscribe(res => {
      saveAs(res, 'KQDG_DC_'+item.employeeName+'.pdf');
    })
  }

  /**
   * signature
   * @param employeeId
   */
  public signature(item) {
    this.modalRefSignature = this.modalService.open(AssessmentSignatureComponent, DEFAULT_MODAL_OPTIONS);
    this.modalRefSignature.componentInstance.setFormValue(item.assessmentResultId, item.assessmentPeriodId, item.employeeId);
    this.modalRefSignature.result.then((result) => {
      //this.prepareEvaluateEmployee(this.evaluateEmployeeInfo.employeeId);
      this.processSearchWithDomain(null);
    });
  }

  deleteEmployee(item){
    this.app.confirmMessage('assessmentPeriod.deletesigleEmployeeMapping', () => { // accept
      this.assessmentPeriodService.processDeleteEmployeeMappingByEmpId(item.assessmentPeriodId, item.assessmentEmployeeId).subscribe(res =>{
        this.processSearchWithDomain(null);
      })
    }, ()=>{
      // reject
    })
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
      assessmentPeriodId: item.assessmentPeriodId
    });
    this.modalRefReEvaluate.result.then((result) => {
      this.processSearchWithDomain(null);
      this.app.successMessage('assessmentResult.reEvaluate');
    });
  }

  bindingEvaluatingLevel(item){
    if(item.evaluatingLevel !=null){
      if(item.evaluatingLevel == item.maxEvaluatingLevel && item.signStatus == 3){
        return "Đã hoàn thành";
      }
      else if(item.evaluatingLevel == item.maxEvaluatingLevel && item.signStatus == 2){
        return "Từ chối ký";
      }
      else if(item.evaluatingLevel == item.maxEvaluatingLevel && item.signStatus == 1){
        return "Đang trình ký";
      }
      else if(item.evaluatingLevel == item.maxEvaluatingLevel && item.signStatus == 0){
        return "Chưa trình ký";
      }
      else if(item.evaluatingLevel < item.maxEvaluatingLevel){
        const lv = item.evaluatingLevel;
        let name = "Chưa xác định";
        item.levelNameEmployeeList.forEach(function(obj){
          if(obj.assessmentOrder == lv){
            item.nextStaff = obj.assessmentOrder + 1;
            name = obj.levelNameEmployeeMapping;
          }
        });
        return name;
      }
    }else{
      return "Chưa đánh giá";
    }
  }
}
