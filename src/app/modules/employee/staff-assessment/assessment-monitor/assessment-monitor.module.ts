
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedModule } from '@app/shared';
import { ReactiveFormsModule } from '@angular/forms';
import { AccordionModule } from 'primeng/accordion';
import { AssessmentMonitorComponent } from './assessment-monitor.component';
import { AssessmentMonitorIndexComponent } from './assessment-monitor-index/assessment-monitor-index.component';
import { AssessmentMonitorRoutingModule } from './assessment-monitor-routing.module';
import { AssessmentMonitorSlackingComponent } from './assessment-monitor-slacking/assessment-monitor-slacking.component';
import { AssessmentMonitorReminderComponent } from './assessment-monitor-reminder/assessment-monitor-reminder.component';
import { AssessmentMonitorFormComponent } from './assessment-monitor-form/assessment-monitor-form.component';

@NgModule({
  declarations: [
    AssessmentMonitorComponent,
    AssessmentMonitorIndexComponent,
    AssessmentMonitorFormComponent,
    AssessmentMonitorSlackingComponent,
    AssessmentMonitorReminderComponent,
  ],
  providers: [DatePipe],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    AccordionModule,
    AssessmentMonitorRoutingModule
  ],
  entryComponents: [
    AssessmentMonitorSlackingComponent,
    AssessmentMonitorReminderComponent,
  ],
})
export class AssessmentMonitorModule {}
