import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { IdeologicalExpressionReportIndexComponent } from './ideological-expression-report/index/ideological-expression-report-index.component';
import { IdeologicalExpressionReportFormComponent } from './ideological-expression-report/form/ideological-expression-report-form.component';
import { PropagandaRoutingModule } from './propaganda-routing.module';
import { RewardDecideFormComponent } from './reward-decide/reward-decide-form/reward-decide-form.component';
import { RewardDecideIndexComponent } from './reward-decide/reward-decide-index/reward-decide-index.component';
import { RewardDecideSearchComponent } from './reward-decide/reward-decide-search/reward-decide-search.component';
import { RewardFormAddComponent } from './reward-form/reward-form-add/reward-form-add.component';
import { RewardFormIndexComponent } from './reward-form/reward-form-index/reward-form-index.component';
import { RewardFormSearchComponent } from './reward-form/reward-form-search/reward-form-search.component';
import { FileChooserProposalComponent } from './reward-proposal/file-chooser-proposal/file-chooser-proposal.component';
import { RewardProposalFormComponent } from './reward-proposal/reward-proposal-form/reward-proposal-form.component';
import { RewardProposalIndexComponent } from './reward-proposal/reward-proposal-index/reward-proposal-index.component';
import { RewardProposalSearchComponent } from './reward-proposal/reward-proposal-search/reward-proposal-search.component';
import { RewardThoughtReportAddComponent } from './reward-thought-report/reward-thought-report-add/reward-thought-report-add.component';
import { RewardThoughtReportDetailComponent } from './reward-thought-report/reward-thought-report-detail/reward-thought-report-detail.component';
import { RewardThoughtReportIndexComponent } from './reward-thought-report/reward-thought-report-index/reward-thought-report-index.component';
import { RewardThoughtReportRequestComponent } from './reward-thought-report/reward-thought-report-request/reward-thought-report-request.component';
import { RewardThoughtReportSearchComponent } from './reward-thought-report/reward-thought-report-search/reward-thought-report-search.component';
import { RewardThoughtmAddComponent } from './reward-thought/reward-thought-add/reward-thought-add.component';
import { RewardThoughtIndexComponent } from './reward-thought/reward-thought-index/reward-thought-index.component';
import { RewardThoughtSearchComponent } from './reward-thought/reward-thought-search/reward-thought-search.component';
import { TreeTableModule } from 'primeng/primeng';
import { ExpressionReportRecordedIndexComponent } from './expression-report-recorded/expression-report-recorded-index/expression-report-recorded-index.component';
import { ExpressionReportRecordedAddComponent } from './expression-report-recorded/expression-report-recorded-add/expression-report-recorded-add.component';
import { ExpressionReportRecordedSearchComponent } from './expression-report-recorded/expression-report-recorded-search/expression-report-recorded-search.component';
import { RewardThoughtImportManageComponent } from './reward-thought/file-import-reward-thought/file-import-reward-thought.component';

@NgModule({
  declarations: [
    RewardProposalIndexComponent,
    RewardFormSearchComponent,
    RewardFormAddComponent,
    RewardProposalSearchComponent,
    RewardProposalFormComponent,
    RewardFormIndexComponent,
    FileChooserProposalComponent,
    RewardDecideIndexComponent,
    RewardThoughtImportManageComponent,
    RewardDecideSearchComponent,
    RewardDecideFormComponent,
    RewardThoughtIndexComponent,
    RewardThoughtSearchComponent,
    RewardThoughtmAddComponent,
    RewardThoughtReportSearchComponent,
    RewardThoughtReportIndexComponent,
    RewardThoughtReportAddComponent,
    RewardThoughtReportDetailComponent,
    RewardThoughtReportRequestComponent,
    IdeologicalExpressionReportIndexComponent,
    IdeologicalExpressionReportFormComponent,
    ExpressionReportRecordedIndexComponent,
    ExpressionReportRecordedAddComponent,
    ExpressionReportRecordedSearchComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    PropagandaRoutingModule,
    TreeTableModule
  ],
  entryComponents: [
    RewardThoughtImportManageComponent
  ]
})
export class PropagandaModule { }
