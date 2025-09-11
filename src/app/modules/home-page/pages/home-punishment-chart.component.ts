import { Component, OnInit, ViewChild } from '@angular/core';
import { UIChart } from 'primeng/chart';
import { FormGroup } from '@angular/forms';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { DashboardService } from '../service/dash-board-service';

@Component({
  selector: 'home-punishment-chart',
  templateUrl: './home-punishment-chart.component.html'
})
export class HomePunishmentChartComponent extends BaseComponent implements OnInit {
  @ViewChild("chart") chart: UIChart;
  barData: any;
  // data biểu đồ
  data = {
    labels: [],
    datasets: [
      {
        label: 'Tổng số kỷ luật',
        backgroundColor: 'rgba(0, 204, 153, 1)',
        borderColor: 'rgba(0, 204, 153, 1)',
        data: []
      }
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
    this.dashboardService.getCountPunishmentForYear().subscribe(res =>{
      const data = res.data;
      if (data) {
        const keys = Object.keys(res.data);
        keys.forEach(key => {
          if(data.hasOwnProperty(key)) {
            let value = data[key];
            this.data.labels.push(key);
            this.data.datasets[0].data.push(value);
          }
        });
      }
      this.barData = this.data;
    });
   }

  ngOnInit() {
  }

}
