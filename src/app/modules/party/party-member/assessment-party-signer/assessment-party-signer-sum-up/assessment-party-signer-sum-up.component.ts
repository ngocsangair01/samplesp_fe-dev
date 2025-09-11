import { AppComponent } from '@app/app.component';
import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { FormArray, FormGroup } from '@angular/forms';
import { AssessmentPeriodService } from '@app/core/services/assessmentPeriod/assessment-period.service';
import { Router } from '@angular/router';
import { AssessmentPartySignerService } from '@app/core/services/assessment-party-signer/assessment-party-signer.service';

@Component({
  selector: 'assessment-party-signer-sum-up',
  templateUrl: './assessment-party-signer-sum-up.component.html'
})
export class AssessmentPartySignerSumUpComponent extends BaseComponent implements OnInit {
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
  constructor(
    private assessmentPartySignerService: AssessmentPartySignerService,
    private assessmentPeriodService: AssessmentPeriodService,
    private router: Router,
    private app: AppComponent
  ) {
    super(null, CommonUtils.getPermissionCode('resource.assessmentLevelPartyOrganization'));
    this.formSearch = this.buildForm({}, this.formConfig);
  }

  ngOnInit() {
    // get periodList da ban hanh
    this.assessmentPeriodService.getAssessmentPeriodListPromulgated()
    .subscribe(res => {
      this.assessmentPeriodList = res;
      if (this.assessmentPeriodList && this.assessmentPeriodList.length > 0) {
        this.formSearch.controls['assessmentPeriodId'].setValue(this.assessmentPeriodList[0].assessmentPeriodId);
        this.handleGetValueForLevelOrder(true);
      }
    });
  }
  get f() {
    return this.formSearch.controls;
  }

  handleGetValueForLevelOrder(isSearch: boolean) {
    if (this.formSearch.controls['assessmentPeriodId'].value) {
      // get list for assessment level order
      const form = {
        assessmentPeriodId: this.formSearch.controls['assessmentPeriodId'].value
      }
      this.assessmentPartySignerService.getAssessmentLevelOrderList(form)
      .subscribe(res => {
        if (this.assessmentPartySignerService.requestIsSuccess(res)) {
          this.assessmentLevelOrderList = res.data;
          if (this.assessmentLevelOrderList && this.assessmentLevelOrderList.length > 0) {
            this.formSearch.controls['assessmentOrder'].setValue(this.assessmentLevelOrderList[0].assessmentOrder);
            if (isSearch) {
              setTimeout(() => this.processSearchSumUp(null), 1000) ;
            }
          }
        }
      })
    }
    return;
  }

  processSearchSumUp(event?: any) {
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    this.assessmentPartySignerService.processSearchSumUp(this.formSearch.value, event)
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
    this.assessmentPartySignerService.getCriteriaKeyByPeriodIdAndAssessmentOrder(form)
    .subscribe(res => {
      this.criteriaKeys = res.data;
    })
  }

  
  processUpdateAndCloseResult() {
    const dataList = this.dataSumUp.data;
    const listChosenEmployeeId = []
    if (dataList != null && dataList.length > 0) {
      dataList.forEach(item => {  
        if (item.isChoose) {
          listChosenEmployeeId.push(item.employeeId);
        }
      })
    }
    if (!CommonUtils.isValidForm(this.formSearch)) {
      return;
    }
    this.app.confirmMessage('assessmentSumUp.message.updateAndClose', () => { // on accepted
      const formData = this.formSearch.value;
      formData.listChosenEmployeeId = listChosenEmployeeId;
      this.assessmentPartySignerService.processUpdateAndCloseResult(formData)
      .subscribe(res => {
        if (this.assessmentPartySignerService.requestIsSuccess(res)) {
          this.processSearchSumUp(null);
        }
      })
    }, () => {
      // on rejected
    });
    
  }

  cancel() {
    this.router.navigate(['/party-organization/assessment-party-signer'])
  }
}
