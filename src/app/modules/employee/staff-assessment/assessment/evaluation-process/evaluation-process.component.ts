import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AssessmentService } from '@app/core/services/employee/assessment.service';
import { AssessmentSignPreviewModalComponent2 } from './preview-modal-sign2/assessment-sign-preview-modal2.component';
import { ASSESSMENT_OBJECT } from '@app/core';
import { QualityAnalysisPartyMemberService } from '@app/core/services/party-organization/quality-analysis-party-member.service';
@Component({
  selector: 'evaluation-process',
  templateUrl: './evaluation-process.component.html',
  styleUrls: ['./evaluation-process.css']
})
export class EvaluationProcessComponent extends BaseComponent implements OnInit {
  // width screen
  scrWidth: any
  employeeId: number;
  transCode: any;
  option: number;
  dataAssessmentResults: any = {};
  constructor(
    public activeModal: NgbActiveModal,
    private assessmentService: AssessmentService,
    private modalService: NgbModal,
    private qualityAnalysisPartyMemberService: QualityAnalysisPartyMemberService,
  ) {
    super(null)

  }

  setParamsRequest(data) {
    this.employeeId = data.employeeId;
    this.option = data.assessmentObject;

    if (data.assessmentObject === ASSESSMENT_OBJECT.DANG_VIEN) {
      this.assessmentService.getAssessmentEmployeeResult(data.employeeId,2).subscribe((res) => {
        this.dataAssessmentResults = res;
      })
    } else {
      this.assessmentService.getAssessmentEmployeeResult(data.employeeId,1).subscribe((res) => {
        this.dataAssessmentResults = res;
      })
    }
    // if (data.assessmentObject === ASSESSMENT_OBJECT.DANG_VIEN) {
    //   this.qualityAnalysisPartyMemberService.getListQualityAnalysisPartyMember({ employeeId: data.employeeId }).subscribe((res) => {
    //     this.dataAssessmentResults = res;
    //   })
    // } else {
    //   this.assessmentService.getEvaluationProcess(data.employeeId).subscribe((res) => {
    //     this.dataAssessmentResults = res;
    //   })
    // }
  }
  ngOnInit() {

  }

  public processDownloadFile(item) {
    this.assessmentService.processDownloadFile(item.vtCriticalId).subscribe(res => {
      saveAs(res, `${item.vtCriticalId}.pdf`);
    });

  }

  public async openModalViewFile(data: any, transCode: any) {
    const formData = {
      transCode: transCode,
    }

    const modalRef = this.modalService.open(AssessmentSignPreviewModalComponent2, {size: 'lg',backdrop: 'static',windowClass:'dialog-preview-file modal-xxl' ,keyboard: false});
    modalRef.componentInstance.evaluateEmployeeData = formData;
    modalRef.componentInstance.dataFile = data;
    modalRef.componentInstance.showAction = false;
    modalRef.componentInstance.transCode = transCode;
      // let param = {
      //   assessmentPeriodId: this.assessmentPeriodId,
      //   employeeId: this.evaluateEmployeeData.employeeId || this.employeeInfo.employeeId,
      //   assessmentOrder: this.employeeInfo.evaluatingLevel ? this.employeeInfo.evaluatingLevel : 1,
      // }
      // const rest = await this.assessmentEmployeeLevelService.viewListFileAssessmentLevel(param).toPromise();
      // if (rest && rest.type === RESPONSE_TYPE.SUCCESS) {
      //   this.templateFileList = rest.data;
      //   this.downloadFile.toggle($event);
      // }
  }

  public staff(option: number) {
    this.option = option;
    if (option === ASSESSMENT_OBJECT.DANG_VIEN) {
      this.assessmentService.getAssessmentEmployeeResult(this.employeeId,2).subscribe((res) => {
        this.dataAssessmentResults = res;
      })
    } else {
      this.assessmentService.getAssessmentEmployeeResult(this.employeeId,1).subscribe((res) => {
        this.dataAssessmentResults = res;
      })
    }
  }
}
