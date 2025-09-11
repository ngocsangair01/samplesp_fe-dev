import {Component, NgModule, OnInit} from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { EmployeeResolver } from '@app/shared/services/employee.resolver';
import { AssessmentService } from '@app/core/services/employee/assessment.service';
import { CommonUtils } from '@app/shared/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PreviewAsessmentModal2Component } from './preview-assessment-modal/preview-assessment-modal.component';
import { LARGE_MODAL_OPTIONS } from '@app/core';

import {DialogService} from "primeng/api";
import {
  PreviewAssessmentShowmoreComponent
} from "@app/modules/employee/curriculum-vitae/assessment/assessment-index-search/preview-assessment-showmore/preview-assessment-showmore.component";
import { CurriculumVitaeService } from '@app/core/services/employee/curriculum-vitae.service';

@Component({
  selector: 'assessment-search',
  templateUrl: './assessment-search.component.html',
  styleUrls: ['./preview-assessment-showmore/preview-assessment-showmore.component.css']
})
export class AssessmentSearchComponent extends BaseComponent implements OnInit {
  employeeId: number;
  empId: {employeeId: any};
  hideAssessment: boolean = false;
  constructor(
    private assessmentService: AssessmentService,
    private employeeResolver: EmployeeResolver,
    private modalService: NgbModal,
    public dialogService: DialogService,
    private curriculumVitaeService: CurriculumVitaeService
    ) {
    super(null, CommonUtils.getPermissionCode("resource.employeeManager"));
    this.setMainService(assessmentService);
    this.employeeResolver.EMPLOYEE.subscribe(
      data => {
        if (data) {
            this.employeeId = data;
            this.empId = {employeeId: data};
            this.formSearch =  this.buildForm(this.empId, {employeeId: ['']});
            this.processSearch();
        }
      }
    );
  }

  /**
   * ngOnInit
   */
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

  public processDownloadFile(item) {
    this.assessmentService.processDownloadFile(item.vtCriticalId).subscribe(res => {
      saveAs(res, `${item.vtCriticalId}.pdf`);
    });

  }

  previewFile(data: any, transCode: any) {
    const formData = {
      transCode: transCode
    }
    const modalRef = this.modalService.open(PreviewAsessmentModal2Component, LARGE_MODAL_OPTIONS);
    modalRef.componentInstance.evaluateEmployeeData = formData;
    modalRef.componentInstance.dataFile = data;
    modalRef.componentInstance.showAction = false;
    modalRef.componentInstance.transCode = transCode;
  }

  public viewMore(data: string) {
      if(data){
        this.buildFormMoreAchievements(data);
      }
  }

  public buildFormMoreAchievements(data: string){
    console.log("data binding: ", data)
    const ref = this.dialogService.open(PreviewAssessmentShowmoreComponent, {
      header: 'THÀNH TÍCH',
      width: '50%',
      // height: '80%',
      baseZIndex: 1000,
      contentStyle: {"padding": "0"},
      data: {
        achievements: data
      }
    });
  }

}
