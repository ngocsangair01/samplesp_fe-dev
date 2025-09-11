import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { APP_CONSTANTS } from '@app/core/app-config';
import { AssessmentEmployeeService } from '@app/core/services/employee/assessment-employee.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { TranslationService } from 'angular-l10n';

@Component({
  selector: 'assessment-statistic',
  templateUrl: './assessment-statistic.component.html'
})
export class AssessmentStatisticComponent extends BaseComponent implements OnInit {
  assessmentStatisticTypeList = APP_CONSTANTS.FIELD_TYPE_LIST
  @Input()
  public assessmentPeriodId: number
  @Input()
  public assessmentStatusStatistics: boolean
  @Input()
  public resultOfAssessment: boolean
  assessmentCriteriaIdParams: any
  isDisplayResult: boolean = true
  isDisplayStatus: boolean = true
  organizationId = null;
  options = {}
  dataTemp = {
    labels: [],
    datasets: [
      {
        backgroundColor: [],
        hoverBackgroundColor: [],
        data: []
      }
    ]
  }
  data = {}
  dataResultOfAssessment = {}
  dataResultOfAssessmentTmp = {
    labels: [],
    datasets: [
      {
        backgroundColor: [
        ],
        hoverBackgroundColor: [
        ],
        data: []
      },
    ]
  }
  formConfig = {
    orgNameLevel1: [''],
    orgIdLevel1: [''],
    employee_id: ['']
  }

  makeDefaultData(){
    this.dataResultOfAssessmentTmp = {
      labels: [],
      datasets: [
        {
          backgroundColor: [
          ],
          hoverBackgroundColor: [
          ],
          data: []
        },
      ]
    }
    this.dataTemp = {
      labels: [],
      datasets: [
        {
          backgroundColor: [],
          hoverBackgroundColor: [],
          data: []
        }
      ]
    }
  }

  constructor(private assessmentEmployeeService: AssessmentEmployeeService, private translation: TranslationService,) {
    super(null, "STAFF_ASSESSMENT");
  }
  public getUnitListAssessmentStatistics(event?): void {
    this.assessmentEmployeeService.getUnitListAssessmentStatistics(this.assessmentCriteriaIdParams, event).subscribe(res => {
      this.resultList = res;
    });
    if (!event) {
      if (this.dataTable) {
        this.dataTable.first = 0;
      }
    }
  }

  /**
  * exportAssessmentStatistic
  */
  public exportAssessmentStatistic(orgIdLevel1: any) {

    const form = {
      assessmentPeriodId: this.assessmentCriteriaIdParams,
      orgIdLevel1: orgIdLevel1 || null
    }
    const credentials = Object.assign({}, form);
    const searchData = CommonUtils.convertData(credentials);
    const params = CommonUtils.buildParams(searchData);

    this.assessmentEmployeeService.exportAssessmentStatistic(params).subscribe(res => {
      if (this.assessmentStatusStatistics && form.orgIdLevel1 === null) {
        saveAs(res, 'Danh_sách_tỷ_lệ_hoàn_thành_đánh_giá.xlsx');
      } else if (this.resultOfAssessment && form.orgIdLevel1 === null) {
        saveAs(res, 'Danh_sách_tỷ_lệ_kết_quả_đánh_giá.xlsx');
      } else if (form.orgIdLevel1 !== null) {
        saveAs(res, 'Danh_sách_đơn_vị_tỷ_lệ_phần_hoàn_thành_đánh_giá.xlsx');
      }
    });
  }

  public onChangeData(data){
    if(data){
      this.organizationId = data;
      this.makeDefaultData();
      this.filterData();
    }
  }

  ngOnInit() {
    this.filterData();
    //this.getUnitListAssessmentStatistics(null);
  }

  filterData(){
    this.getOption();
    this.assessmentEmployeeService.getAssessmentStatusStatistics(this.assessmentPeriodId, this.organizationId).subscribe(
      res => {
        if ((res.data['totalAssessmentEmployeeHaveAssessment'] + res.data['totalAssessmentEmployeeNotYetAssessment']) === 0) {
          this.isDisplayStatus = false
        } else {
          this.isDisplayStatus = true
          this.dataTemp.labels.push(APP_CONSTANTS.ASSESSMENT_STATUS.HAVE_ASSESSMENT)
          this.dataTemp.labels.push(APP_CONSTANTS.ASSESSMENT_STATUS.NOT_YET_ASSESSMENT)
          this.dataTemp.datasets[0].backgroundColor.push(APP_CONSTANTS.PIE_CHART_COLOR[0])
          this.dataTemp.datasets[0].backgroundColor.push(APP_CONSTANTS.PIE_CHART_COLOR[1])
          this.dataTemp.datasets[0].hoverBackgroundColor.push(APP_CONSTANTS.PIE_CHART_COLOR[0])
          this.dataTemp.datasets[0].hoverBackgroundColor.push(APP_CONSTANTS.PIE_CHART_COLOR[1])
          this.dataTemp.datasets[0].data.push(res.data.totalAssessmentEmployeeHaveAssessment)
          this.dataTemp.datasets[0].data.push(res.data.totalAssessmentEmployeeNotYetAssessment)
          this.data = this.dataTemp
        }
      })
    this.assessmentEmployeeService.getResultOfAssessment(this.assessmentPeriodId, this.organizationId).subscribe(
      res => {
        if (res.data['Chưa có kết quả'] === 0) {
          this.isDisplayResult = false
        } else {
          this.isDisplayResult = true
          const data = res.data
          const keys = Object.keys(data)
          let i = 0
          keys.forEach(key => {
            if (data.hasOwnProperty(key)) {
              let value = data[key]
              this.dataResultOfAssessmentTmp.labels.push(key)
              this.dataResultOfAssessmentTmp.datasets[0].data.push(value)
              this.dataResultOfAssessmentTmp.datasets[0].backgroundColor.push(APP_CONSTANTS.PIE_CHART_COLOR[i])
              this.dataResultOfAssessmentTmp.datasets[0].hoverBackgroundColor.push(APP_CONSTANTS.PIE_CHART_COLOR[i])
              i++
            }
          })
          this.dataResultOfAssessment = this.dataResultOfAssessmentTmp
        }
      })
    this.assessmentCriteriaIdParams = this.assessmentPeriodId
  }

  getOption() {
    const percent = this.translation.translate('app.laborStructureChart.percent');
    this.options = {
      tooltips: {
        mode: 'single',
        callbacks: {
          afterBody: function (tooltipItem, data) {
            const dataset = data.datasets[0].data[tooltipItem[0].index];
            let sum = 0;
            const dataArr = data.datasets[0].data;
            dataArr.map(value => {
              sum += value;
            });
            const percentage = (dataset * 100 / sum).toFixed(1) + '%';
            const multistringText = [percent + percentage];
            return multistringText;
          },
        }
      },
      legend: {
        onClick: null
      },
      plugins: {
        datalabels: {
          formatter: (value, ctx) => {
            let sum = 0;
            const dataArr = ctx.chart.data.datasets[0].data;
            dataArr.map(data => {
              sum += data;
            });
            const percentage = (value * 100 / sum).toFixed(1) + '%';
            return percentage;
          },
          color: 'white',
          font: {
            size: 14,
            weight: 'bold'
          },
          display: true
        },
      }
    };
  }
}
