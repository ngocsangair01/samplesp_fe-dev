import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssessmentIndexComponent } from './assessment-index/assessment-index.component';
import { AssessmentRoutingModule } from './assessment-routing.module';
import { SharedModule } from '@app/shared';
import { ChartModule } from 'primeng/chart';
import { AssessmentStatisticComponent } from '../assessment-statistic/assessment-statistic.component';
import { AssessmentNotificationComponent } from './assessment-notification/assessment-notification.component';
import { PanelModule} from 'primeng/primeng';

@NgModule({
  declarations: [
    AssessmentIndexComponent,
    AssessmentStatisticComponent,
    AssessmentNotificationComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AssessmentRoutingModule,
    ChartModule,
    PanelModule,
  ],
  entryComponents: [AssessmentNotificationComponent
  ],
})
export class AssessmentModule { }
