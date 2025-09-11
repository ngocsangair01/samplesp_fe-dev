import { AppComponent } from '@app/app.component';
import { AssessmentPartyOrganizationService } from './../../../../../core/services/assessment-party-organization/assessment-party-organization.service';
import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { FormGroup } from '@angular/forms';
import { AssessmentPeriodService } from '@app/core/services/assessmentPeriod/assessment-period.service';
import { Router } from '@angular/router';

@Component({
  selector: 'assessment-party-organization-sum-up',
  templateUrl: './assessment-party-organization-sum-up.component.html'
})
export class AssessmentPartyOrganizationSumUpComponent extends BaseComponent implements OnInit {
  formSearch: FormGroup;
  formConfig = {
    partyOrganizationId: [null, ValidationService.required],
    assessmentPeriodId: [null, ValidationService.required],
    assessmentOrder: [null, ValidationService.required]
  };
  dataSumUp: any = {};
  assessmentPeriodList = [];
  assessmentLevelOrderList = [];
  dataSumUpTotal: any = {};
  criteriaKeys = [];
  isMobileScreen: boolean = false;
  constructor(
    private assessmentPartyOrganizationService: AssessmentPartyOrganizationService,
    private assessmentPeriodService: AssessmentPeriodService,
    private router: Router,
    private app: AppComponent
  ) {
    super(null, CommonUtils.getPermissionCode('resource.assessmentPartyOrganization'));
    this.formSearch = this.buildForm({}, this.formConfig);
    this.isMobileScreen = window.innerWidth >= 375 && window.innerWidth < 540;
  }

  ngOnInit() {
    // get periodList da ban hanh
    this.assessmentPeriodService.getAssessmentPeriodListPromulgated()
    .subscribe(res => {
      this.assessmentPeriodList = res;
      if (this.assessmentPeriodList && this.assessmentPeriodList.length > 0) {
        this.formSearch.controls['assessmentPeriodId'].setValue(this.assessmentPeriodList[0].assessmentPeriodId);
        this.handleGetValueForLevelOrder();
      }
    });
    setTimeout(() => {
      this.processSearchSumUp(null);
    }, 1000);
  }

  get f() {
    return this.formSearch.controls;
  }

  handleGetValueForLevelOrder() {
    if (this.formSearch.controls['assessmentPeriodId'].value) {
      // get list for assessment level order
      const form = {
        assessmentPeriodId: this.formSearch.controls['assessmentPeriodId'].value
      }
      this.assessmentPartyOrganizationService.getAssessmentLevelOrderList(form)
      .subscribe(res => {
        if (this.assessmentPartyOrganizationService.requestIsSuccess(res)) {
          this.assessmentLevelOrderList = res.data;
          if (this.assessmentLevelOrderList && this.assessmentLevelOrderList.length > 0) {
            this.onchangePartyOrg()
          }
        }
      })
    }
    this.formSearch.controls['assessmentOrder'].setValue('');
    return;
  }

  processSearchSumUp(event?: any) {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    this.assessmentPartyOrganizationService.processSearchSumUp(this.formSearch.value, event)
    .subscribe(res => {
      this.dataSumUp = res;
    })
    if (!event) {
      if (this.dataTable) {
        this.dataTable.first = 0;
      }
    }
  }

  handleGetCriteriaKey() {
    const form = {
      assessmentPeriodId: this.formSearch.controls['assessmentPeriodId'].value,
      assessmentOrder: this.formSearch.controls['assessmentOrder'].value
    };
    this.assessmentPartyOrganizationService.getCriteriaKeyByPeriodIdAndAssessmentOrder(form)
    .subscribe(res => {
      this.criteriaKeys = res.data;
    })
  }

  public processShowCriteria(criteria, assessmentResult): string {
    let str = '';
    if (assessmentResult != null) {
      const criteriaCode = criteria.assessmentCriteriaCode;
      const fieldType = criteria.fieldType;
      const result = JSON.parse(assessmentResult);
      result.forEach(element => {
        if (element.assessmentCriteriaCode == criteriaCode) {
          // type is text box or textarea
          if (fieldType == 2 || fieldType == 7) {
            str = element.assessmentCriteriaValue;
          } else {
            str = element.assessmentCriteriaLabel;
          }
        }
      });
    }
    return str;
  }

  processUpdateAndCloseResult() {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    this.app.confirmMessage('assessmentSumUp.message.updateAndClose', () => { // on accepted
      this.assessmentPartyOrganizationService.processUpdateAndCloseResult(this.formSearch.value)
      .subscribe(res => {
        if (this.assessmentPartyOrganizationService.requestIsSuccess(res)) {
          this.processSearchSumUp(null);
        }
      })
    }, () => {
      // on rejected
    });
    
  }

  processExport() {
    this.assessmentPartyOrganizationService.processExportSumUp(this.formSearch.value).subscribe(res => {
      saveAs(res, 'Tổng hợp xếp loại Đảng viên.xlsx');
    })
  }

  cancel() {
    this.router.navigate(['/party-organization/assessment-party-organization'])
  }

  onchangePartyOrg() {
    // get next assessmentOrder for party org
    this.assessmentPartyOrganizationService.getNextAssessmentOrder(this.formSearch.value).subscribe(res => {
      if (res.data && (res.data.type == 6 || res.data.type == 15)) {
        this.formSearch.controls['assessmentOrder'].setValue(res.data.assessmentOrder || this.assessmentLevelOrderList[0].assessmentOrder);
      } else {
        this.formSearch.controls['assessmentOrder'].setValue(this.assessmentLevelOrderList[0].assessmentOrder);
      }
      this.handleGetCriteriaKey();
    })
  }

}
