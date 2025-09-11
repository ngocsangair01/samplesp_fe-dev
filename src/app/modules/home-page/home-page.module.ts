import { HomePunishmentMultiChartComponent } from './pages/home-punishment-multi-chart.component';
import { HomePunishmentChartComponent } from './pages/home-punishment-chart.component';
import { HomeCongressComponent } from './pages/home-congress.component';
import { HomeTreeViewComponent } from './pages/home-tree-view.component';
import { NgModule } from '@angular/core';
import { HomeComponent } from './pages/home.component';
import { HomePageRoutingModule } from './home-page.routing';
import { ChartModule } from 'primeng/chart';
import { SharedModule } from '@app/shared';
import { HomeWarningComponent } from './pages/home-warning.component';
import { HomeLineChartComponent } from './pages/home-line-chart.component';
import { HomeNotificationComponent } from './pages/home-notification.component';
import { HomeBarChartComponent } from './pages/home-bar-chart.component';
import { HomePieChartComponent } from './pages/home-pie-chart.component';
import { HomePoliticalComponent } from './pages/home-political.component';
import { PropagandaComponent } from './pages/home-propaganda.component';


@NgModule({
    declarations: [
        HomeComponent,
        HomeWarningComponent,
        HomePieChartComponent,
        HomeLineChartComponent,
        HomeNotificationComponent,
        HomeBarChartComponent,
        HomeTreeViewComponent,
        HomePoliticalComponent,
        HomeCongressComponent,
        HomePunishmentChartComponent,
        HomePunishmentMultiChartComponent,
        PropagandaComponent
    ],
    imports: [
        SharedModule,
        ChartModule,
        HomePageRoutingModule,
    ],
    exports: [],
    providers: [],
    entryComponents: []
})
export class HomePageModule {}
