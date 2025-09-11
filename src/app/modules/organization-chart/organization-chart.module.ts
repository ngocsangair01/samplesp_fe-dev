
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared';
import { OrganizationTotalComponent } from './organization-total.component';
import { OrganizationChartRoutingModule } from './organization-chart-routing.module';
import { OrganizationChartComponent } from './organization-chart-view/organization-chart.component';
import { TreeViewComponent } from './organization-chart-view/tree-view/tree-view.component';

@NgModule({
  declarations: [
    OrganizationTotalComponent,
    OrganizationChartComponent, 
    TreeViewComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    OrganizationChartRoutingModule,
  ],
  entryComponents:[],
})
export class OrganizationChartModule {
}
