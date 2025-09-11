
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrganizationTotalComponent } from './organization-total.component';
import { OrganizationChartComponent } from './organization-chart-view/organization-chart.component';

const routes: Routes = [
  {
    path: '',
    component: OrganizationTotalComponent,
    children: [
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],    
  exports: [RouterModule]
})
export class OrganizationChartRoutingModule { }   
