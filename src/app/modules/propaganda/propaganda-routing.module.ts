import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpressionReportRecordedAddComponent } from './expression-report-recorded/expression-report-recorded-add/expression-report-recorded-add.component';
import { ExpressionReportRecordedIndexComponent } from './expression-report-recorded/expression-report-recorded-index/expression-report-recorded-index.component';
import { IdeologicalExpressionReportIndexComponent } from './ideological-expression-report/index/ideological-expression-report-index.component';
import { RewardDecideFormComponent } from './reward-decide/reward-decide-form/reward-decide-form.component';
import { RewardDecideIndexComponent } from './reward-decide/reward-decide-index/reward-decide-index.component';
import { RewardFormAddComponent } from './reward-form/reward-form-add/reward-form-add.component';
import { RewardFormIndexComponent } from './reward-form/reward-form-index/reward-form-index.component';
import { RewardProposalFormComponent } from './reward-proposal/reward-proposal-form/reward-proposal-form.component';
import { RewardProposalIndexComponent } from './reward-proposal/reward-proposal-index/reward-proposal-index.component';
import { RewardThoughtReportAddComponent } from './reward-thought-report/reward-thought-report-add/reward-thought-report-add.component';
import { RewardThoughtReportDetailComponent } from './reward-thought-report/reward-thought-report-detail/reward-thought-report-detail.component';
import { RewardThoughtReportIndexComponent } from './reward-thought-report/reward-thought-report-index/reward-thought-report-index.component';
import { RewardThoughtReportRequestComponent } from './reward-thought-report/reward-thought-report-request/reward-thought-report-request.component';
import { RewardThoughtmAddComponent } from './reward-thought/reward-thought-add/reward-thought-add.component';
import { RewardThoughtIndexComponent } from './reward-thought/reward-thought-index/reward-thought-index.component';

const routes: Routes = [
  {
    path: 'reward-form',
    component: RewardFormIndexComponent,
  }, {
    path: 'reward-form/add',
    component: RewardFormAddComponent,
  }, {
    path: 'reward-form/edit/:id',
    component: RewardFormAddComponent,
  }, {
    path: 'reward-form/view/:id',
    component: RewardFormAddComponent,
  }, {
    path: 'reward-proposal',
    component: RewardProposalIndexComponent,
  }, {
    path: 'reward-proposal-edit/:id',
    component: RewardProposalFormComponent,
  }, {
    path: 'reward-proposal-add',
    component: RewardProposalFormComponent,
  }, {
    path: 'reward-proposal/:id/:view',
    component: RewardProposalFormComponent,
  }, {
    path: 'reward-decide',
    component: RewardDecideIndexComponent,
  }, {
    path: 'reward-decide/add',
    component: RewardDecideFormComponent,
  }, {
    path: 'reward-decide/edit/:id',
    component: RewardDecideFormComponent,
  }, {
    path: 'reward-decide/view/:id',
    component: RewardDecideFormComponent,
  }, {
    path: 'reward-thought',
    component: RewardThoughtIndexComponent,
  }, {
    path: 'reward-thought/add',
    component: RewardThoughtmAddComponent,
  }, {
    path: 'reward-thought/:id/:view',
    component: RewardThoughtmAddComponent,
  }, {
    path: 'reward-thought/:id/:edit',
    component: RewardThoughtmAddComponent,
  }, {
    path: 'reward-thought-report',
    component: RewardThoughtReportIndexComponent,
  }, {
    path: 'reward-thought-report/add',
    component: RewardThoughtReportAddComponent,
  }, {
    path: 'reward-thought-report/:id/view',
    component: RewardThoughtReportDetailComponent,
  }, {
    path: 'reward-thought-report/:id/update',
    component: RewardThoughtReportDetailComponent,
  }, {
    path: 'reward-thought-report/update/:id',
    component: RewardThoughtReportAddComponent,
  }, {
    path: 'reward-thought-report/:id/add',
    component: RewardThoughtReportRequestComponent,
  }, {
    path: 'reward-thought-report/:id/update/:eovResultId',
    component: RewardThoughtReportRequestComponent,
  }, {
    path: 'ideological-expression-report',
    component: IdeologicalExpressionReportIndexComponent,
  }, {
    path: 'ideological-expression-report/add',
    component: RewardFormAddComponent,
  }, {
    path: 'ideological-expression-report/edit/:id',
    component: RewardFormAddComponent,
  }, {
    path: 'ideological-expression-report/view/:id',
    component: RewardFormAddComponent,
  }, {
    path: 'expression-report-recorded',
    component: ExpressionReportRecordedIndexComponent,
  }, {
    path: 'expression-report-recorded/add',
    component: ExpressionReportRecordedAddComponent,
  }, {
    path: 'expression-report-recorded/:id/view',
    component: ExpressionReportRecordedAddComponent,
  }, {
    path: 'expression-report-recorded/:id/edit',
    component: ExpressionReportRecordedAddComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PropagandaRoutingModule { }
