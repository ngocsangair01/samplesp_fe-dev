import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, DEFAULT_MODAL_OPTIONS, LARGE_MODAL_OPTIONS } from '@app/core';
import { APP_CONSTANTS, CONFIG } from '@app/core/app-config';
import { AssessmentPeriodService } from '@app/core/services/assessmentPeriod/assessment-period.service';
import { AssessmentFormulaService } from '@app/core/services/employee/assessment-formula.service';
import { CategoryService } from '@app/core/services/setting/category.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { environment } from '@env/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AssessmentPeriodImportComponent } from '../assessment-period-import/assessment-period-import.component';
import { AssessmentPeriodStaffListComponent } from '../assessment-period-staff-list/assessment-period-staff-list.component';
import { AssessmentPeriodImportForPartyOrganizationComponent } from '../assessment-period-import-for-party-organization/assessment-period-import-for-party-organization.component';
import { AssessmentEmployeeFormComponent } from '../assessment-employee-form/assessment-employee-form.component';
import { AssessmentPeriodDeleteByPartyOrganizationComponent } from '../assessment-period-delete-by-party-organization/assessment-period-delete-by-party-organization.component';

@Component({
  selector: 'assessment-period-search',
  templateUrl: './assessment-period-search.component.html',
  styleUrls: ['./assessment-period-search.component.css']
})
export class AssessmentPeriodSearchComponent extends BaseComponent implements OnInit {
  formSearch: FormGroup
  public ICON_API_URL = environment.serverUrl['assessment'] + CONFIG.API_PATH['settingIcon'] +   '/icon/';
  formConfig = {
    assessmentPeriodId: [''],
    assessmentPeriodName: [''],
    assessmentTypeId: [''],
    assessmentTypeName: [''],
    formulaId: [''],
    effectiveDate: [''],
    toEffectiveDate: [''],
    expiredDate: [''],
    toExpiredDate: [''],
    description: [''],
    status: [''],
    isPartyMemberAssessment: [''],
    isLock: [''],
    assessmentObject: [''],
    isAssessmentPeriodId: [false],
    isAssessmentPeriodName: [false],
    isAssessmentTypeId: [false],
    isAssessmentTypeName: [false],
    isFormulaId: [false],
    isEffectiveDate: [false],
    isToEffectiveDate: [false],
    isExpiredDate: [false],
    isToExpiredDate: [false],
    isDescription: [false],
    isStatus: [false],
    isShowPartyMemberAssessment: [false],
    isShowLock: [false],
    isAssessmentObject: [false]
  }
  formulaList: any;
  assessmentTypeList: any;
  isPartyMemberAssessmentList: any;
  assessmentPeriodStatusList: any;
  assessmentObjectList: any;
  isMobileScreen: boolean = false;
  constructor(
    private router: Router,
    private app: AppComponent,
    private assessmentPeriodService: AssessmentPeriodService,
    private categoryService: CategoryService,
    private assessmentFormulaService: AssessmentFormulaService,
    private modalService: NgbModal // manhnh
  ) { 
    super(null,'ASSESSMENT_PERIOD');
    this.setMainService(assessmentPeriodService)
    this.formSearch = this.buildForm({}, this.formConfig, ACTION_FORM.VIEW,
      [ValidationService.notAffter('effectiveDate', 'toEffectiveDate', 'assessmentPeriod.toDate'),
      ValidationService.notAffter('expiredDate', 'toExpiredDate', 'assessmentPeriod.toDate')]);
    this.assessmentPeriodStatusList = APP_CONSTANTS.ASSESSMENT_PERIOD_STATUS_LIST;
    this.isPartyMemberAssessmentList = APP_CONSTANTS.IS_PARTY_MEMBER_ASSESSMENT_LIST;
    this.assessmentObjectList = APP_CONSTANTS.ASSESSMENT_OBJECT;
    this.categoryService.findByCategoryTypeCode("ASSESSMENT_PERIOD_TYPE").subscribe(res => {
      this.assessmentTypeList = res.data;
    });
    // get formula list
    this.assessmentFormulaService.findAll().subscribe(res => {
      this.formulaList = res.data
    })
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
  }

  ngOnInit() {
    this.processSearch(null)
  }

  get f() {
    return this.formSearch.controls;
  }

  /** 
   * go to save or update
   */
  prepareSaveOrUpdate(item?: any) {
    if (item && item.assessmentPeriodId > 0) {
      this.router.navigate(['/employee/assessment/manager-field/assessment-period/edit/', item.assessmentPeriodId]);
    } else {
      this.router.navigate(['/employee/assessment/manager-field/assessment-period/add']);
    }
  }

  prepareView(assessmentPeriodId) {
    this.router.navigate(['/employee/assessment/manager-field/assessment-period/view/', assessmentPeriodId]);
  }

  /** 
   * process export assessment period
   */
  processExport() {
    const credentials = Object.assign({}, this.formSearch.value);
    const searchData = CommonUtils.convertData(credentials);
    const params = CommonUtils.buildParams(searchData);
    this.assessmentPeriodService.export(params).subscribe(res => {
      saveAs(res, 'danh_sach_ky_danh_gia.xlsx');
    });
  }

  processDeleteEmployeeMapping(assessmentPeriodId) {
    this.app.confirmMessage('assessmentPeriod.deleteEmployeeMapping', () => { // accept
      this.assessmentPeriodService.processDeleteEmployeeMapping(assessmentPeriodId).subscribe(res =>{
        this.processSearch(null)
      })
    }, ()=>{
      // reject
    })
  }

  processPromulgate(assessmentPeriodId) {
      this.app.confirmMessage('assessmentPeriod.message.processPromulgate', () => {
        // accept
        this.assessmentPeriodService.processPromulgate(assessmentPeriodId).subscribe(res =>{
          this.processSearch(null)
        })
      }, () => {// reject})
      })
  }

  processShowStaffAssessmentList(assessmentPeriod) {
    // show component staff assessment list
    const modalRef = this.modalService.open(AssessmentPeriodStaffListComponent, LARGE_MODAL_OPTIONS);
    if(assessmentPeriod.assessmentPeriodId > 0) {
      modalRef.componentInstance.setDataList(assessmentPeriod);
    }
    modalRef.result.then((result) => {
      if (!result) {
        return;
      }
      this.processSearch(null)
    });
  }

  // manhnh start
  private activeModel(data?: any) {
    const modalRef = this.modalService.open(AssessmentPeriodImportComponent, DEFAULT_MODAL_OPTIONS);
    if (data) {
      modalRef.componentInstance.setFormValue(this.propertyConfigs, data);
    }
    // modalRef.result.then((result) => {
    //   if (!result) {
    //     return;
    //   }
    //   if (this.assessmentPeriodService.requestIsSuccess(result)) {
    //     this.processSearch();
    //   }
    // });
  }

  processStaffImport(item) {
    this.activeModel(item);
  }
  // manhnh end

  /**
   * Process make list party member for party organization
   * @param item is record in grid
   */
  processAssessmentWithPartyOrg(item) {
    // validate da ban hanh thi ko dc lap danh sach
    this.assessmentPeriodService.findOne(item.assessmentPeriodId).subscribe(res => {
      if (res.data.status == 1) {
        this.app.warningMessage('assessmentPeriod.import.validate')
      } else {
        const modalRef = this.modalService.open(AssessmentPeriodImportForPartyOrganizationComponent, DEFAULT_MODAL_OPTIONS);
        if (item) {
          modalRef.componentInstance.setFormValue(item.assessmentPeriodId);
        }
        modalRef.result.then((result) => {
          if (!result) {
            return;
          }
          if (this.assessmentPeriodService.requestIsSuccess(result)) {
            this.processSearch();
          }
        });
      }
    })
  }

  /**
   * Xoa can bo danh gia theo TCD
   * @param item is record in grid
   */
   processDeleteAssessmentByPartyOrg(item) {
    if (item && item.assessmentPeriodId) {
      const modalRef = this.modalService.open(AssessmentPeriodDeleteByPartyOrganizationComponent, DEFAULT_MODAL_OPTIONS);
      modalRef.componentInstance.setFormValue(item.assessmentPeriodId);
      modalRef.result.then((result) => {
        if (!result) {
          return;
        }
        if (this.assessmentPeriodService.requestIsSuccess(result)) {
          this.processSearch();
        }
      });
    }
  }

  prepareCreateStaffAssessment(item) {
    const modalRef = this.modalService.open(AssessmentEmployeeFormComponent, DEFAULT_MODAL_OPTIONS);
    const data = {
      assessmentPeriodId: item.assessmentPeriodId,
      isPartyMemberAssessment: item.isPartyMemberAssessment
    }
    modalRef.componentInstance.setFormValue(data);
    modalRef.result.then((result) => {
      if (result) {
        this.processSearch();
      }
    });
  }

  processResetAssessmentRessult(assessmentPeriodId) {
    this.app.confirmDelete('assessmentPeriod.confirm.resetAssessemntResult', () => {
      this.assessmentPeriodService.resetAssessmentRessult(assessmentPeriodId).subscribe(res => {
        if (this.assessmentPeriodService.requestIsSuccess(res)) {
          this.processSearch();
        }
      })
    }, () => {})
  }

  processLockOrUnLock(event, item: any){
     if(item.isLock == 1){
       this.assessmentPeriodService.processLock(item.assessmentPeriodId).subscribe(res =>{
         item.isLock = 0;
         this.processSearch(null)
       });
     }
     else if(item.isLock == 0) {
       this.assessmentPeriodService.processLock(item.assessmentPeriodId).subscribe(res =>{
         item.isLock = 1;
         this.processSearch(null)
       });
     }
  }
}
