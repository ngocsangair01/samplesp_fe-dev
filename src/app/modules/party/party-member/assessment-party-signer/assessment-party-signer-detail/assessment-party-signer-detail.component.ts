import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { FormGroup } from '@angular/forms';
import _ from 'lodash';
import { AssessmentPartySignerService } from '@app/core/services/assessment-party-signer/assessment-party-signer.service';

@Component({
  selector: 'assessment-party-signer-detail',
  templateUrl: './assessment-party-signer-detail.component.html'
})
export class AssessmentPartySignerDetailComponent extends BaseComponent implements OnInit {
  formSearch: FormGroup;
  assessmentPartySignerId: number;
  formConfig = {
    assessmentPeriodName: [''],
    assessmentPeriodId: [''],
    assessmentPartySignerId:[''],
    percent: ['']
  };
  dataDetail: any = {};
  criteriaKeys: any = [];
  constructor(
    private router: Router,
    private AssessmentPartySignerService: AssessmentPartySignerService,
    public actr: ActivatedRoute,
  ) {
    super(null, CommonUtils.getPermissionCode('resource.assessmentLevelPartyOrganization'));
    this.formSearch = this.buildForm({}, this.formConfig);
    this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        const params = this.actr.snapshot.params;
        if (params) {
          this.assessmentPartySignerId = params.id;
        }
      }
    });
  }

  get f() {
    return this.formSearch.controls;
  }

  ngOnInit() {
    if (this.assessmentPartySignerId) {
      this.AssessmentPartySignerService.getBaseInforDetail(this.assessmentPartySignerId)
        .subscribe(res => {
          var data = _.cloneDeep(res.data);
          const percent = (data.empComplete / data.totalEmp) * 100;
          data['percent'] = data.empComplete + "/" + data.totalEmp + " = " + percent.toFixed(2) + "%";
          this.formSearch = this.buildForm(data, this.formConfig);
          const form = {
            assessmentPeriodId: data.assessmentPeriodId,
            assessmentLevel: data.assessmentLevel
          };
          this.AssessmentPartySignerService.getCriteriaKeyByPeriodIdAndAssessmentOrder(form)
          .subscribe(res => {
            this.criteriaKeys = res.data;
            this.processSearchDetail();
          })
        })
    }
  }

  processSearchDetail(event?: any) {
    this.AssessmentPartySignerService.processSearchDetail(this.formSearch.value, event)
    .subscribe(res => {
      this.dataDetail = res;
    })
    if (!event) {
      if (this.dataTable) {
        this.dataTable.first = 0;
      }
    }
  }

  cancel() {
    this.router.navigate(['/party-organization/assessment-party-signer'])
  }

  processShowCriteria(criteria, assessmentResult) {
    let str = '';
    if (assessmentResult != null) {
      const criteriaCode = criteria.assessmentCriteriaCode;
      const fieldType = criteria.fieldType;
      const result = JSON.parse(assessmentResult);
      result.forEach(element => {
        if (element.assessmentCriteriaCode === criteriaCode) {
          // type is text box or textarea
          if (fieldType == 2 || fieldType == 7) {
            str = element.assessmentCriteriaValue;
            return;
          } else {
            str = element.assessmentCriteriaLabel;
            return;
          }
        }
      });
    }
    return str;
  }
}
