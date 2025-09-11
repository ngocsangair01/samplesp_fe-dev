import { AssessmentPartyOrganizationService } from './../../../../../core/services/assessment-party-organization/assessment-party-organization.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { FormGroup } from '@angular/forms';
import _ from 'lodash';

@Component({
  selector: 'assessment-party-organization-detail',
  templateUrl: './assessment-party-organization-detail.component.html',
  styleUrls: ['./assessment-party-organization-detail.component.css']
})
export class AssessmentPartyOrganizationDetailComponent extends BaseComponent implements OnInit {
  formSearch: FormGroup;
  assessmentPartyOrganizationId: number;
  formConfig = {
    partyOrganizationId: [''],
    partyOrganizationName: [''],
    assessmentPeriodName: [''],
    assessmentPeriodId: [''],
    assessmentOrder: [''],
    assessmentLevelName: [''],
    percent: ['']
  };
  dataDetail: any = {};
  criteriaKeys: any = [];
  constructor(
    private router: Router,
    private assessmentPartyOrganizationService: AssessmentPartyOrganizationService,
    public actr: ActivatedRoute,
  ) {
    super(null, CommonUtils.getPermissionCode('resource.assessmentPartyOrganization'));
    this.formSearch = this.buildForm({}, this.formConfig);
    this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        const params = this.actr.snapshot.params;
        if (params) {
          this.assessmentPartyOrganizationId = params.id;
        }
      }
    });
  }

  get f() {
    return this.formSearch.controls;
  }

  ngOnInit() {
    if (this.assessmentPartyOrganizationId) {
      this.assessmentPartyOrganizationService.getBaseInforDetail(this.assessmentPartyOrganizationId)
        .subscribe(res => {
          var data = _.cloneDeep(res.data);
          const percent = (data.empComplete / data.totalEmp) * 100;
          data['percent'] = data.empComplete + "/" + data.totalEmp + " = " + percent.toFixed(2) + "%";
          this.formSearch = this.buildForm(data, this.formConfig);
          const form = {
            assessmentPeriodId: data.assessmentPeriodId,
            assessmentOrder: data.assessmentOrder
          };
          this.assessmentPartyOrganizationService.getCriteriaKeyByPeriodIdAndAssessmentOrder(form)
          .subscribe(res => {
            this.criteriaKeys = res.data;
            this.processSearchDetail();
          })
        })
    }
  }

  processSearchDetail(event?: any) {
    this.assessmentPartyOrganizationService.processSearchDetail(this.formSearch.value, event)
    .subscribe(res => {
      this.dataDetail = res;
    })
    if (!event) {
      if (this.dataTable) {
        this.dataTable.first = 0;
      }
    }
  }

  processShowCriteria(criteria, assessmentResult) {
    let str = '';
    if (assessmentResult != null) {
      const criteriaCode = criteria.assessmentCriteriaCode;
      const fieldType = criteria.fieldType;
      const result = JSON.parse(assessmentResult);
      result.forEach(element => {
        // if (element.assessmentCriteriaCode === 'DCN_CN_TNX_01') {
        //   console.log('criteriaCode', criteriaCode);
          
        // }
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

  cancel() {
    this.router.navigate(['/party-organization/assessment-party-organization'])
  }
}
