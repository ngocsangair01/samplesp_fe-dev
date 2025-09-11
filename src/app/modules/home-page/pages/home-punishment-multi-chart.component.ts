import { Component, OnInit, ViewChild } from '@angular/core';
import { UIChart } from 'primeng/chart';
import { DashboardService } from '../service/dash-board-service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';

@Component({
  selector: 'home-punishment-multi-chart',
  templateUrl: './home-punishment-multi-chart.component.html'
})
export class HomePunishmentMultiChartComponent extends BaseComponent implements OnInit {
  @ViewChild("chart") chart: UIChart;
  barData: any;
  // data biểu đồ
  data = {
    labels: [],
    datasets: [
      {
        label: '',
        backgroundColor: 'rgba(255, 112, 77, 1)',
        borderColor: 'rgba(255, 64, 0, 1)',
        data: []
      },
      {
        label: '',
        backgroundColor: 'rgba(0, 204, 153, 1)',
        borderColor: 'rgba(0, 204, 153, 1)',
        data: []
      }
    ],
  };
   // cấu hình biểu đồ
  option = {
    legend: { // ẩn nút legend
        display: true
    },
    scales: {
      yAxes: [{
          ticks: {
              beginAtZero: true, // value luôn từ 0
          }
      }],
      xAxes: [{
        ticks: {
            fontSize: 10,
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
    private dashboardService: DashboardService,
  ) { 
    super();
    this.dashboardService.getCountPunishmentForQuater().subscribe(res =>{
      const data = res.data;
      var d = new Date();
      var currentYear = d.getFullYear();
      if (data) {
        const keys = Object.keys(res.data);
        keys.forEach(key => {
          if(data.hasOwnProperty(key)) {
            let value = data[key];
            this.data.labels.push("Quý " + key);
            this.data.datasets[0].data.push(value.year1St);
            this.data.datasets[0].label = "Năm " + (currentYear - 1);
            this.data.datasets[1].data.push(value.year2nd);
            this.data.datasets[1].label = "Năm " + currentYear;
          }
        });
      }
      this.barData = this.data;
    });
  }

  ngOnInit() {
  }

}
