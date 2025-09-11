import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared';
import { TransferEmployeeIndexComponent } from './transfer-employee-index/transfer-employee-index.component';
import { TransferEmployeeRoutingModule } from './transfer-employee-routing.module';
import { TransferEmployeeSearchComponent } from './transfer-employee-search/transfer-employee-search.component';
import { TransferEmployeeFormComponent } from './transfer-employee-form/transfer-employee-form.component';
import { TransferEmployeeEvaluateComponent } from './transfer-employee-evaluate/transfer-employee-evaluate.component';
import { AssessmentSearchComponent } from './transfer-employee-evaluate/assessment/assessment-search.component';
import { WorkProcessSearchComponent } from './transfer-employee-evaluate/work-process/work-process-search.component';
import { RewardPartyMemberComponent } from './transfer-employee-evaluate/reward-party-member/reward-party-member.component';
import { RewardDisplineGovernmentComponent } from './transfer-employee-evaluate/reward-displine-government/reward-displine-government.component';

@NgModule({
  declarations: [

    TransferEmployeeIndexComponent,
    TransferEmployeeSearchComponent,
    TransferEmployeeFormComponent,
    TransferEmployeeEvaluateComponent,
    AssessmentSearchComponent,
    WorkProcessSearchComponent,
    RewardPartyMemberComponent,
    RewardDisplineGovernmentComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    TransferEmployeeRoutingModule
  ],
  entryComponents: [],
  providers: [

  ]
})
export class TransferEmployeeModule { }
