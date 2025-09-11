import { Component, OnInit } from '@angular/core';
import { HomeEmployeeService } from '@app/core/services/home/home-employee.service';
import { TranslationService } from 'angular-l10n';
import * as moment from 'moment';
@Component({
  selector: 'home-line-chart',
  templateUrl: './home-line-chart.component.html'
})
export class HomeLineChartComponent implements OnInit {
  data: any;
  labels: any = [];
  employeesCount = 0;
  condi = 1;
  isShowChart = false;
  isShowDOB = false;
  employeesPercent = 0;
  employeesRetire = 0;
  constructor(
    private homeEmployeeService: HomeEmployeeService,
    private translation: TranslationService
  ) {
  }
  ngOnInit() {

  }

  checkOnChange(condi) {
    this.condi = condi;
  }

  /* Hàm dùng chung -------------------------------------------------------------------------------------*/
  checkOnData(labels, dataNewEmp, dataReEmp) {
    return (this.data = {
      labels: labels,
      datasets: [
        {
          label: this.translation.translate('homeReport.newEmp'),
          data: dataNewEmp,
          fill: false,
          borderColor: '#2e8ccd'
        },
        {
          label: this.translation.translate('homeReport.retireEmp'),
          data: dataReEmp,
          fill: false,
          borderColor: '#dc3545'
        }
      ]
    });
  }
  // Lấy tất cả các date (theo điều kiện) với start date và end date
  getDateArray(start: Date, end: Date, condition?) {
    const arr = [];
    if (condition === 'month') {
      for (const dt = start; dt <= end; dt.setDate(dt.getDate() + 1)) {
        arr.push(moment(dt).format('DD/MM'));
      }
    }
    if (condition === 'year') {
      for (const dt = start; dt <= end; dt.setMonth(dt.getMonth() + 1)) {
        arr.push(moment(dt).format('MM/YYYY'));
      }
    } else {
      for (const dt = start; dt <= end; dt.setDate(dt.getDate() + 1)) {
        arr.push(moment(dt).format('YYYY-MM-DD'));
      }
    }
    return arr;
  }

  /* Hàm filter theo Days ------------------------------------------------------------------------*/
  // Lấy label dựa theo ngày hiện tại ( Sunday - Saturday : 0 - 6 ) <=> (Chủ Nhật - Thứ 7 : 0 - 6)
  getLabelsByPresentDay() {
    const date = new Date().getDate() - 7;
    const labels = [];
    const dataDays = [
      { id: 1, name: this.translation.translate('homeReport.day.2') },
      { id: 2, name: this.translation.translate('homeReport.day.3') },
      { id: 3, name: this.translation.translate('homeReport.day.4') },
      { id: 4, name: this.translation.translate('homeReport.day.5') },
      { id: 5, name: this.translation.translate('homeReport.day.6') },
      { id: 6, name: this.translation.translate('homeReport.day.7') },
      { id: 0, name: this.translation.translate('homeReport.day.8') }
    ];
    for (let i = date; i < new Date().getDate(); i++) {
      const temp = new Date(new Date().getFullYear(), new Date().getMonth(), i);
      dataDays.forEach(elementDays => {
        if (temp.getDay() === elementDays.id) {
          labels.push(elementDays.name);
        }
      });
    }
    return labels;
  }
  getDaysByDates(data: any) {
    const dayNewTemp: any = [];
    data.forEach(elementNewTemp =>
      dayNewTemp.push(new Date(elementNewTemp.sangnnStartDate).getDay())
    );
    return dayNewTemp;
  }
  getNumberOfEmpByDays(dataWork: any) {
    const dataFinal = [0, 0, 0, 0, 0, 0, 0];
    const dayResult = this.getDaysByDates(dataWork);
    for (let i = 0; i < dayResult.length; i++) {
      if (dayResult[i] === 0) {
        dataFinal[6]++;
      }
      if (dayResult[i] === 1) {
        dataFinal[0]++;
      }
      if (dayResult[i] === 2) {
        dataFinal[1]++;
      }
      if (dayResult[i] === 3) {
        dataFinal[2]++;
      }
      if (dayResult[i] === 4) {
        dataFinal[3]++;
      }
      if (dayResult[i] === 5) {
        dataFinal[4]++;
      }
      if (dayResult[i] === 6) {
        dataFinal[5]++;
      }
    }
    return dataFinal;
  }

  /*Hàm filter theo Month ----------------------------------------------------------------------- */
  getLabelsByPresentMonth() {
    const date = new Date();
    const daylist = this.getDateArray(
      new Date(date.setMonth(new Date().getMonth() - 1)),
      new Date(),
      'month'
    );
    return daylist;
  }
  getNumberOfEmpByMonths(data: any) {
    const dataNewTemp = [];
    const timespan = [];
    data.forEach(e => {
      const date = new Date(e.sangnnStartDate);
      timespan.push(moment(date).format('DD/MM'));
    });
    const getLabelsByPresentMonth = this.getLabelsByPresentMonth();
    getLabelsByPresentMonth.forEach(e => {
      dataNewTemp.push(0);
    });
    getLabelsByPresentMonth.forEach(eleLabel => {
      timespan.forEach(eleConvert => {
        if (eleLabel === eleConvert) {
          dataNewTemp[getLabelsByPresentMonth.indexOf(eleLabel)]++;
        }
      });
    });
    return dataNewTemp;
  }

  /*Hàm filter theo Year ----------------------------------------------------------------------- */
  getLabelsByPresentYear() {
    const date = new Date();
    const daylist = this.getDateArray(
      new Date(date.setMonth(new Date().getMonth() - 12)),
      new Date(),
      'year'
    );
    return daylist;
  }
  getNumberOfEmpByYears(data: any) {
    const dataNewTemp = [];
    const timespan = [];
    data.forEach(e => {
      const date = new Date(e.sangnnStartDate);
      timespan.push(moment(date).format('MM/YYYY'));
    });
    this.getLabelsByPresentYear().forEach(e => {
      dataNewTemp.push(0);
    });
    this.getLabelsByPresentYear().forEach(eleLabel => {
      timespan.forEach(eleConvert => {
        if (eleLabel === eleConvert) {
          dataNewTemp[this.getLabelsByPresentYear().indexOf(eleLabel)]++;
        }
      });
    });
    return dataNewTemp;
  }
}
