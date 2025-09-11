import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { EmpTypesService } from '@app/core/services/emp-type.service';
import { DashboardService } from '../service/dash-board-service';
import { UIChart } from 'primeng/chart';

@Component({
  selector: 'home-bar-chart',
  templateUrl: './home-bar-chart.component.html',
})
export class HomeBarChartComponent extends BaseComponent implements OnInit {
  @ViewChild("chart") chart: UIChart;
  barData: any;
  empTypeList;
  formSearch: FormGroup;
  formConfig = {
    empTypeId: [''],
  };
  // data biểu đồ
  data = {
    labels: [],
    datasets: [
      {
        label: 'Số cán bộ',
        backgroundColor: 'rgba(0, 204, 153, 1)',
        borderColor: 'rgba(0, 204, 153, 1)',
        data: []
      },
    ],
  };
   // cấu hình biểu đồ
  option = {
    legend: { // ẩn nút legend
        display: false
    },
    scales: {
      yAxes: [{
          ticks: {
              beginAtZero: true, // value luôn từ 0
          }
      }],
      xAxes: [{
        ticks: {
            fontSize: 8,
            fontStyle: "bold",
        },
      }]
    },
    plugins: {
      datalabels: {
        display: false
      }
    }
  };
  constructor(
    private empTypeService: EmpTypesService,
    private dashboardService: DashboardService,
  ) {
    super();
    this.formSearch = this.buildForm({}, this.formConfig);
    this.empTypeService.getNoneStaffAreaEmpType().subscribe(
      resET => {
        this.empTypeList = resET.data;
        this.formSearch.controls['empTypeId'].setValue(resET.data[0].empTypeId);
        this.dashboardService.getBarData(this.formSearch.value.empTypeId).subscribe(
          resDB => {
            const data = resDB.data;
            if (data) {
              const keys = Object.keys(resDB.data);
              keys.forEach(key => {
                if (data.hasOwnProperty(key)) {
                  let value = data[key];
                  this.data.labels.push(key);
                  this.data.datasets[0].data.push(value);
                }
              });
            }
            this.barData = this.data;
          }
        );
      }
    );
  }
  
  ngOnInit() {
    this.formSearch = this.buildForm({}, this.formConfig);
  }

  get f() {
    return this.formSearch.controls;
  }

  onChangeEmpType(event) {
    if (event) {
      this.dashboardService.getBarData(event).subscribe(
        resDB => {
          const data = resDB.data;
          if (data) {
            this.data.labels = [];
            this.data.datasets[0].data = [];
            this.barData = [];
            const keys = Object.keys(resDB.data);
            keys.forEach(key => {
              if (data.hasOwnProperty(key)) {
                let value = data[key];
                this.data.labels.push(key);
                this.data.datasets[0].data.push(value);
              }
            });
          }
          this.barData = this.data;
            this.chart.ngOnDestroy();
            this.chart.initChart();
        }
      );
    } else {
      this.barData = [];
    }
  }

  randomColor() {
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);
    const color = 'rgb('+red+','+green+','+blue+')';
    return color;
  }
}
