import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssessmentMonitorFormComponent } from './assessment-monitor-form/assessment-monitor-form.component';
import { AssessmentMonitorComponent } from './assessment-monitor.component';

const routes: Routes = [
  {
    path: '',
    component: AssessmentMonitorComponent,
    children: [
        {
          path: '',
          component: AssessmentMonitorFormComponent
        },
        {
          path: 'search/:id',
          component: AssessmentMonitorFormComponent
        }
      ]
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AssessmentMonitorRoutingModule {}
