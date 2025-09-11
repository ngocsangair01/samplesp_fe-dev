import { MenuItem } from 'primeng/api';
import { AssessmentPeriodService } from './../../../../../core/services/assessmentPeriod/assessment-period.service';
import { AssessmentCriteriaGroup } from './../assessment-interface';
import { Component, HostListener, OnInit } from '@angular/core';
import { CONFIG } from '@app/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { environment } from '@env/environment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ASSESSMENT_FIELD_TYPE } from '../assessment-interface';
import { FormControl, FormGroup } from '@angular/forms';
import { AssessmentResultService } from '@app/core/services/employee/assessment-result.service';
import {el} from "@angular/platform-browser/testing/src/browser_util";

@Component({
  selector: 'assessment-history-log',
  templateUrl: './assessment-history-log.component.html'
})
export class AssessmentHistoryLogComponent extends BaseComponent implements OnInit {
  public ICON_API_URL = environment.serverUrl['assessment'] + CONFIG.API_PATH['settingIcon'] + '/icon/'
  public AVATAR_API_URL = environment.serverUrl['political'] + CONFIG.API_PATH['employee-image'] + '/'
  // params request
  paramsRequest: any
  // assessment criteria list
  assessmentCriteriaGroupList: AssessmentCriteriaGroup[]
  // file type
  assessmentFieldType = ASSESSMENT_FIELD_TYPE
  // assessment form
  formAssessment: FormGroup
  json: JSON = JSON
  // employee has been evaluation info
  evaluateEmployeeInfo: any = {}
  // assessmentLevelInfoList
  assessmentLevelInfoList: any = []
  // result of formula
  result: any = {}
  // assessment criteria
  assessmentCriteria: any[] = []

  // item tabMenu
  items: any
  // width screen
  scrWidth: any
  // init itemMenu
  itemMenu: MenuItem
  constructor(
    public activeModal: NgbActiveModal,
    private assessmentResultService: AssessmentResultService,
    private assessmentPeriodService: AssessmentPeriodService
  ) {
    super(null)
    this.formAssessment = this.buildForm({}, {});
    // set assessmentLevelInfoList
  }

  setParamsRequest(data,isInit) {
    if(isInit){
      this.paramsRequest = data.paramsRequest
      this.result = data.result
      this.evaluateEmployeeInfo = data.evaluateEmployeeInfo
      this.ngOnInit();
    }else {
      this.paramsRequest = data.paramsRequest
      this.result = data.result
      this.evaluateEmployeeInfo = data.evaluateEmployeeInfo
    }

  }
  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.scrWidth = window.innerWidth
  }

  /**
   * Build assessment dynamic form
   * 
   * @param data 
   */
  private rebuildForm(data): void {
    if (data.listAssessmentCriteriaGroups !== null) {
      this.assessmentCriteriaGroupList = data.listAssessmentCriteriaGroups
      this.buildAssessmentDynamicForm()
    }
  }

  private buildAssessmentDynamicForm() {
    this.assessmentCriteriaGroupList.forEach(criteriaGroup => {
      criteriaGroup.groupChildList.forEach(groupChild => {
        this.buildAssessmentCriteriaForm(groupChild.listAssessmentCriterias)
      })
    })
  }

  private buildAssessmentCriteriaForm(listAssessmentCriterias) {
    listAssessmentCriterias.forEach(criteria => {
      // get value
      let defaultValue: any = criteria.fieldDefaultValue;
      let exited: boolean = false
      for (const item of this.assessmentCriteria) {
        if (item.assessmentCriteriaCode === criteria.assessmentCriteriaCode) {
          defaultValue = item.assessmentCriteriaValue
          exited = true
          break;
        }
      }
      if (!exited) {
        this.assessmentCriteria.push({
          assessmentCriteriaCode: criteria.assessmentCriteriaCode,
          assessmentCriteriaValue: defaultValue
        })
      }
      if (!isNaN(defaultValue)) {
        if (criteria.fieldType === ASSESSMENT_FIELD_TYPE.DATE
          || criteria.fieldType === ASSESSMENT_FIELD_TYPE.DATE_TIME
          || criteria.fieldType === ASSESSMENT_FIELD_TYPE.TIME
          || criteria.fieldType === ASSESSMENT_FIELD_TYPE.STAR) {
            defaultValue = Number(defaultValue)
        } else if (criteria.fieldType === ASSESSMENT_FIELD_TYPE.SPINNER) {
          defaultValue = parseFloat(defaultValue)
        }
      } else if (criteria.fieldType === ASSESSMENT_FIELD_TYPE.FROM_TO) {
        defaultValue = JSON.parse(defaultValue)
      }
      if (criteria.fieldType === ASSESSMENT_FIELD_TYPE.FROM_TO) {
        // add controls
        this.formAssessment.addControl(criteria.assessmentCriteriaCode + "From", new FormControl(Number(defaultValue.from) ? Number(defaultValue.from) : ''));
        this.formAssessment.addControl(criteria.assessmentCriteriaCode + "To", new FormControl(Number(defaultValue.to) ? Number(defaultValue.to) : ''));
      } else {
        this.formAssessment.addControl(criteria.assessmentCriteriaCode, new FormControl(defaultValue ? defaultValue : ''));
      }
    })
  }

  ngOnInit() {
    if(this.paramsRequest) {
      this.assessmentPeriodService.getAssessmentLevelList(this.paramsRequest).subscribe(res => {
        this.assessmentLevelInfoList = res
        this.processGetInfoByLevel(0)
        if(res) {
          let data = []
          res.forEach((element, idx) => {
            data.push({
              icon: 'pi pi-check-circle',
              label: (idx + 1) + ". " + element.assessmentLevelName,
              command: (event) => {
                this.processGetInfoByLevel(idx)
              }
            })
          });
          this.itemMenu = data[0]
          this.items = data
        }
      })
    }
  }

  private processGetInfoByLevel(index: number) {
    if(this.assessmentLevelInfoList) {
      let paramsRequestFirst =  {...this.paramsRequest
        , employeeCodeLevel: this.assessmentLevelInfoList[index].employeeCodeLevel
        , showHistory: 1};
      paramsRequestFirst.assessmentOrder = this.assessmentLevelInfoList[index].assessmentOrder;
      this.assessmentResultService.getAssessmentEmployeeInfo(paramsRequestFirst).subscribe(res => {
        // set assessment criteria
        if (res.data.assessmentCriteria) {
          this.assessmentCriteria = JSON.parse(res.data.assessmentCriteria)
        }
        // rebuild levelTab
        this.rebuildForm(res.data);
      })
    }
  }

  get fAssessment() {
    return this.formAssessment.controls;
  }
}
