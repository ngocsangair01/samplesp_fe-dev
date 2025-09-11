import { DashboardService } from '../service/dash-board-service';
import { OnInit, Component } from '@angular/core';
import { APP_CONSTANTS } from '@app/core';

@Component({
  selector: 'home-pie-chart',
  templateUrl: './home-pie-chart.component.html'
})
export class HomePieChartComponent implements OnInit {
  dataTmp = {};
  data = {
    labels: [],
    datasets: [
      {
        backgroundColor: [
        ],
        hoverBackgroundColor: [
        ],
        data: []
      },
    ],
  };
  options: any;
  constructor(
    private dashBoardService: DashboardService,
  ) {
    this.dashBoardService.getPieData().subscribe(
      res => {
        const data = res.data;
        const keys = Object.keys(data);
        let i = 0;
        keys.forEach(key => {
          if (data.hasOwnProperty(key)) {
            let value = data[key];
            this.data.labels.push(key);
            this.data.datasets[0].data.push(value);
            this.data.datasets[0].backgroundColor.push(APP_CONSTANTS.PIE_CHART_COLOR[i]);
            this.data.datasets[0].hoverBackgroundColor.push(APP_CONSTANTS.PIE_CHART_COLOR[i]);
            i++;
          }
        });
        this.dataTmp = this.data;
      });
    
    this.options = {
      plugins: {
        datalabels: {
          color: 'white',
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      }
    };
  }
  ngOnInit(): void {
  }

}
