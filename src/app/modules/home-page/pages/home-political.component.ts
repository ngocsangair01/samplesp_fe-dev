import { APP_CONSTANTS } from '@app/core';
import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../service/dash-board-service';

@Component({
  selector: 'home-political',
  templateUrl: './home-political.component.html',
})
export class HomePoliticalComponent implements OnInit {
  resultList: any;
  baseUrl: string = APP_CONSTANTS.POLITICAL_FEATURE.BASE_URL;
  constructor(private dashboardService: DashboardService) {
    this.dashboardService.getPoliticalFeature().subscribe(res => {
      this.resultList = JSON.parse(res.articles);
    })
  }

  ngOnInit() {
  }
}
