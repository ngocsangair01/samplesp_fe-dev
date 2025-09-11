import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { FormGroup } from '@angular/forms';
import { APP_CONSTANTS, DEFAULT_MODAL_OPTIONS } from '@app/core/app-config';
import { StaffAssessmentCriteriaGroupService } from '@app/core/services/employee/staff-assessment-criteria-group.service';
import { AppComponent } from '@app/app.component';
import { ValidationService, CommonUtils } from '@app/shared/services';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StaffAssessmentCriteriaGroupFormComponent } from '../staff-assessment-criteria-group-form/staff-assessment-criteria-group-form.component';
import { ListStaffAssessmentCriteriaComponent } from '../list-staff-assessment-criteria/list-staff-assessment-criteria.component';
import { StaffAssessmentCriteriaFormComponent } from '../../staff-assessment-criteria/staff-assessment-criteria-form/staff-assessment-criteria-form.component';

@Component({
  selector: 'staff-assessment-criteria-group-search',
  templateUrl: './staff-assessment-criteria-group-search.component.html',
  styleUrls: ['./staff-assessment-criteria-group-search.component.css']
})
export class StaffAssessmentCriteriaGroupSearchComponent extends BaseComponent implements OnInit {
  formSearch: FormGroup;
  statusList = APP_CONSTANTS.SELECT_STAFF_ASSESSMENT_CRITERIA_GROUP_STATUS;
  assessmentCriteriaGroupTypeList = APP_CONSTANTS.SELECT_STAFF_ASSESSMENT_CRITERIA_GROUP_TYPE;
  assessmentCriteriaGroupId: number;
  constructor(
    private staffAssessmentCriteriaGroupService: StaffAssessmentCriteriaGroupService,
    private app: AppComponent,
    private modalService: NgbModal,
  ) 
  {  
    super(null,"ASSESSMENT_CRITERIA_GROUP");
    this.setMainService(staffAssessmentCriteriaGroupService);
    this.formSearch = this.buildForm({}, this.formConfig);
  }
  formConfig = {
    assessmentCriteriaGroupId: [''],
    assessmentCriteriaGroupCode: [''],
    assessmentCriteriaGroupName: [''],
    assessmentCriteriaGroupStatus: [''],
    assessmentCriteriaGroupType: [''],
    isAssessmentCriteriaGroupCode: [false],
    isAssessmentCriteriaGroupName: [false],
    isAssessmentCriteriaGroupStatus: [false],
    isAssessmentCriteriaGroupType: [false],
  }
  ngOnInit() {
    this.processSearch();
  }
  // get form
  get f () {
    return this.formSearch.controls;
  }

  /**
   * prepareSaveOrUpdate
   */
  prepareSaveOrUpdate(item) {
    if (item && item.assessmentCriteriaGroupId > 0) {
      if (item.assessmentCriteriaGroupId > 0) {
        this.staffAssessmentCriteriaGroupService.findOne(item.assessmentCriteriaGroupId)
        .subscribe(res => { 
          if (res.data) {
            this.activeModal(res.data);
          }
        });
      } 
    } else {
      this.activeModal({});
    }
  }
  private activeModal(data?: any) {
    const modalRef = this.modalService.open(StaffAssessmentCriteriaGroupFormComponent, DEFAULT_MODAL_OPTIONS);
    if (data) {
      modalRef.componentInstance.setFormValue(data);
    }
    modalRef.result.then((result) => {
      if (!result) {
        return;
      }
      if (this.staffAssessmentCriteriaGroupService.requestIsSuccess(result)) {
        this.processSearch();
        if (this.dataTable) {
          this.dataTable.first = 0;
        }
      }
    });
  }
  /**
   * processDelete
   */
  processDelete(item) {
    if (item && item.assessmentCriteriaGroupId > 0) {
      this.app.confirmDelete(null, () => {
        this.staffAssessmentCriteriaGroupService.deleteById(item.assessmentCriteriaGroupId)
          .subscribe(res => {
            if (this.staffAssessmentCriteriaGroupService.requestIsSuccess(res)) {
              this.processSearch(null);
            }
          });
    })};
  }

  /**
   * processExport
   */
  public processExport() {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    const credentials = Object.assign({}, this.formSearch.value);
    const searchData = CommonUtils.convertData(credentials);
    const params = CommonUtils.buildParams(searchData);
    this.staffAssessmentCriteriaGroupService.export(params).subscribe(res => {
      saveAs(res, 'staffAssessmentCriteriaGroupReport.xlsx');
    });
  }

  /**
   * getListStaffAssessmentCriteriaWithassessmentCriteriaGroupId
   */
  getListAssessmentCriteriaWithAssessmentCriteriaGroupId(item) {
    if (item && item.assessmentCriteriaGroupId > 0) {
      const modalRef = this.modalService.open(ListStaffAssessmentCriteriaComponent, DEFAULT_MODAL_OPTIONS);
      modalRef.componentInstance.setFormValue(item.assessmentCriteriaGroupId, item.assessmentCriteriaGroupCode, item.assessmentCriteriaGroupName);
    } 
  }

   /**
   * addNewStaffAssessmentCriteria
   */
  addNewStaffAssessmentCriteria(item) {
    if (item && item.assessmentCriteriaGroupId > 0) {
      const modalRef = this.modalService.open(StaffAssessmentCriteriaFormComponent, DEFAULT_MODAL_OPTIONS);
      modalRef.componentInstance.setFormValue(item.assessmentCriteriaGroupId, item.assessmentCriteriaGroupCode);
    }
  }
}
