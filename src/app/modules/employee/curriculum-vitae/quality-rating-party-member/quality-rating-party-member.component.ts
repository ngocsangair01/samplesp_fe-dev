import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { EmployeeResolver } from '@app/shared/services/employee.resolver';
import { QualityAnalysisPartyMemberService } from '@app/core/services/party-organization/quality-analysis-party-member.service';
import { CommonUtils } from '@app/shared/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PreviewAsessmentModal2Component } from '../assessment/assessment-index-search/preview-assessment-modal/preview-assessment-modal.component';
import { LARGE_MODAL_OPTIONS } from '@app/core';
import { AssessmentService } from '@app/core/services/employee/assessment.service';
import { CurriculumVitaeService } from '@app/core/services/employee/curriculum-vitae.service';
@Component({
  selector: 'quality-rating-party-member',
  templateUrl: './quality-rating-party-member.component.html',
  styleUrls: ['./quality-rating-party-member.component.css']
})
export class QualityRatingPartyMemberComponent extends BaseComponent implements OnInit {

  data: [];
  recordsTotal: any;
  resultList: any;
  employeeId: number;
  empId: {employeeId: any, status: any};
  hideListQualityRatingPartyMember: boolean = false;
  @ViewChild('ptable') dataTable: any;
  constructor(
    private employeeResolver: EmployeeResolver,
    private qualityAnalysisPartyMemberService: QualityAnalysisPartyMemberService,
    private modalService: NgbModal,
    private assessmentService: AssessmentService,
    private curriculumVitaeService: CurriculumVitaeService
    ) {
    super(null, CommonUtils.getPermissionCode("resource.employeeManager"));
    this.setMainService(qualityAnalysisPartyMemberService);
    this.employeeResolver.EMPLOYEE.subscribe(
      data => {
        if (data) {
            this.employeeId = data;
            this.empId = {employeeId: data, status: 3};
            this.formSearch =  this.buildForm(this.empId, {employeeId: [''], status: ['']});
            this.processSearchListQualityPartyMember();
        }
      }
    );
   }

  ngOnInit() {
    this.curriculumVitaeService.selectMenuItem.subscribe(res => {
      let element = document.getElementById(res);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth'
        });
      }
    })
  }

  processSearchListQualityPartyMember(event?) {
    const params = this.formSearch ? this.formSearch.value : null;
    this.qualityAnalysisPartyMemberService.getListQualityAnalysisPartyMember(params, event)
    .subscribe(res => {
      this.resultList = res;
      this.data = res.data;
      this.recordsTotal = res.recordsTotal;
    });
    if (!event) {
      if (this.dataTable) {
        this.dataTable.first = 0;
      }
    }
  }

  previewFile(data: any, transCode: any, index?: number) {
    const formData = {
      transCode: transCode
    }
    const modalRef = this.modalService.open(PreviewAsessmentModal2Component, LARGE_MODAL_OPTIONS);
    modalRef.componentInstance.evaluateEmployeeData = formData;
    modalRef.componentInstance.dataFile = data;
    modalRef.componentInstance.showAction = false;
    modalRef.componentInstance.transCode = transCode;
    modalRef.componentInstance.index = index;
  }

  public processDownloadFile(item) {
    this.assessmentService.processDownloadFile(item.vtCriticalId).subscribe(res => {
      saveAs(res, `${item.vtCriticalId}.pdf`);
    });
  }
}
