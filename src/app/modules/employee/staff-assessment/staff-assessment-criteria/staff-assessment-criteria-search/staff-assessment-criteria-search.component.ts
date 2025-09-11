import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { StaffAssessmentCriteriaService } from '@app/core/services/employee/staff-assessment-criteria.service';
import { AppComponent } from '@app/app.component';
import { CommonUtils } from '@app/shared/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StaffAssessmentCriteriaFormComponent } from '../staff-assessment-criteria-form/staff-assessment-criteria-form.component';
import { DEFAULT_MODAL_OPTIONS, APP_CONSTANTS, CONFIG } from '@app/core/app-config';
import { environment } from '@env/environment';

@Component({
  selector: 'staff-assessment-criteria-search',
  templateUrl: './staff-assessment-criteria-search.component.html',
  styleUrls: ['./staff-assessment-criteria-search.component.css']
})
export class StaffAssessmentCriteriaSearchComponent extends BaseComponent implements OnInit {

  formSearch: FormGroup;
  fieldTypeList = APP_CONSTANTS.FIELD_TYPE_LIST
  public ICON_API_URL = environment.serverUrl['assessment'] + CONFIG.API_PATH['settingIcon'] +   '/icon/';
  constructor(
    private staffAssessmentCriteriaService: StaffAssessmentCriteriaService,
    private app: AppComponent,
    private modalService: NgbModal,
  ) {
    super(null,"ASSESSMENT_CRITERIA");
    this.setMainService(staffAssessmentCriteriaService);
    this.formSearch = this.buildForm({}, this.formConfig);

   }

   formConfig = {
    assessmentCriteriaId: [''],
    assessmentCriteriaCode: [''],
    assessmentCriteriaName: [''],
    assessmentCriteriaGroupId: [''],
    assessmentCriteriaGroupCode: [''],
    assessmentCriteriaGroupName: [''],
       isAssessmentCriteriaGroupCode: [false],
       isAssessmentCriteriaGroupName: [false],
    fieldType: [''],
    isFieldType: [false],
       isAssessmentCriteriaCode: [false],
       isAssessmentCriteriaName: [false],
    scoringGuide: [''],
    iconName: [''],
  }
   ngOnInit() {
    this.processSearch();
  }

  // get form
  get f () {
    return this.formSearch.controls;
  }

 /**
 * processDelete
 */
  processDelete(item) {
    if (item && item.assessmentCriteriaId > 0) {
      this.app.confirmDelete(null, () => {
        this.staffAssessmentCriteriaService.deleteById(item.assessmentCriteriaId)
          .subscribe(res => {
            if (this.staffAssessmentCriteriaService.requestIsSuccess(res)) {
              this.processSearch(null);
            }
          });
    })};
  }
   /**
   * addNewStaffAssessmentCriteria
   */
  addNewStaffAssessmentCriteria() {
    const modalRef = this.modalService.open(StaffAssessmentCriteriaFormComponent, DEFAULT_MODAL_OPTIONS);
    modalRef.result.then((result) => {
      if (!result) {
        return;
      }
      if (this.staffAssessmentCriteriaService.requestIsSuccess(result)) {
        this.processSearch();
        if (this.dataTable) {
          this.dataTable.first = 0;
        }
      }
    });
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
    this.staffAssessmentCriteriaService.export(params).subscribe(res => {
      saveAs(res, 'Danh_sách_tiêu_chí_đánh_giá.xlsx');
    });
  }

   /**
   * prepareSaveOrUpdate
   */
  prepareSaveOrUpdate(item) {
    if (item && item.assessmentCriteriaId > 0) {
      if (item.assessmentCriteriaId > 0) {
        this.staffAssessmentCriteriaService.findOne(item.assessmentCriteriaId)
        .subscribe(res => {
          if (res.data) {
            this.activeModal(res.data);
            // this.processSearch();
          }
        });
      }
    } else {
      this.activeModal({});
      // this.processSearch();
    }
  }

  private activeModal(data?: any) {
    const modalRef = this.modalService.open(StaffAssessmentCriteriaFormComponent, DEFAULT_MODAL_OPTIONS);
    if (data) {
      modalRef.componentInstance.setFormCriteriaValue(data);
    }
    modalRef.result.then((result) => {
      if (!result) {
        return;
      }
      if (this.staffAssessmentCriteriaService.requestIsSuccess(result)) {
        this.processSearch();
        if (this.dataTable) {
          this.dataTable.first = 0;
        }
      }
    });
  }

  public goToCriteriaView(id: number) {
    if (id > 0) {
      this.staffAssessmentCriteriaService.findOne(id)
      .subscribe(res => {
        if (res.data) {
          this.activeModalCriteriaView(res.data);
        }
      });
    }

  }

  private activeModalCriteriaView(data?: any) {
    const modalRef = this.modalService.open(StaffAssessmentCriteriaFormComponent, DEFAULT_MODAL_OPTIONS);
    if (data) {
      modalRef.componentInstance.getViewCriteria(data);
    }
    modalRef.result.then((result) => {
      if (!result) {
        return;
      }
      if (this.staffAssessmentCriteriaService.requestIsSuccess(result)) {
        this.processSearch();
        if (this.dataTable) {
          this.dataTable.first = 0;
        }
      }
    });
  }

  onChangeFieldType(ev){

  }
}
