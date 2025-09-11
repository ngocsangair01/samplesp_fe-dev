
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared';
import { FundRoutingModule } from './fund-routing.module';
import { FundManagementComponent } from './fund-management/fund-management-index.component';
import { FundManagementSearchComponent } from './fund-management/fund-management-search/fund-management-search.component';
import { FundManagementFormComponent } from './fund-management/fund-management-form/fund-management-form.component';
import { FundContributionComponent } from './fund-contribution/fund-contribution-index.component';
import { FundContributionFormComponent } from './fund-contribution/fund-contribution-form/fund-contribution-form.component';
import { FundContributionSearchComponent } from './fund-contribution/fund-contribution-search/fund-contribution-search.component';
import { FundActivitySearchComponent } from './fund-activity/fund-activity-search/fund-activity-search.component';
import { FundActivityFormComponent } from './fund-activity/fund-activity-form/fund-activity-form.component';
import { FundActivityComponent } from './fund-activity/fund-activity-index.component';
import { FundHistoryIndexComponent } from './fund-management/fund-history/fund-history-index.component';
import { FundHistoryContributionComponent } from './fund-management/fund-history/fund-history-contribution/fund-history-contribution.component';
import { FundHistoryActivityComponent } from './fund-management/fund-history/fund-history-activity/fund-history-activity.component';


@NgModule({
  declarations: [
    FundManagementSearchComponent,
    FundManagementFormComponent,
    FundManagementComponent,
    FundContributionComponent,
    FundContributionFormComponent,
    FundContributionSearchComponent,
    FundManagementSearchComponent,
    FundManagementFormComponent,
    FundManagementComponent,
    FundActivitySearchComponent,
    FundActivityFormComponent,
    FundActivityComponent,
    FundHistoryIndexComponent,
    FundHistoryContributionComponent,
    FundHistoryActivityComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FundRoutingModule
  ],
  exports: [
  ],
  entryComponents: []
})
export class FundModule {
}
