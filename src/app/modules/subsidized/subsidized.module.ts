import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared';
import { SubsidizedRoutingModule } from './subsidized-routing.module';
import { SubsidizedPeriodIndexComponent } from './subsidized-period/subsidized-period-index/subsidized-period-index.component';
import { SubsidizedPeriodSearchComponent } from './subsidized-period/subsidized-period-search/subsidized-period-search.component';
import { SubsidizedPeriodFormComponent } from './subsidized-period/subsidized-period-form/subsidized-period-form.component';
import { SubsidizedInfoIndexComponent } from './subsidized-info/subsidized-info-index/subsidized-info-index.component';
import { SubsidizedInfoSearchComponent } from './subsidized-info/subsidized-info-search/subsidized-info-search.component';
import { SubsidizedInfoFormComponent } from './subsidized-info/subsidized-info-form/subsidized-info-form.component';
import { SubsidizedInfoApproveIndexComponent } from './subsidized-info-approve/subsidized-info-approve-index/subsidized-info-approve-index.component';
import { SubsidizedInfoApproveSearchComponent } from './subsidized-info-approve/subsidized-info-approve-search/subsidized-info-approve-search.component';
import { SubsidizedInfoApproveFormComponent } from './subsidized-info-approve/subsidized-info-approve-form/subsidized-info-approve-form.component';
import { SubsidizedResultIndexComponent } from './subsidized-result/subsidized-result-index/subsidized-result-index.component';
import { SubsidizedResultSearchComponent } from './subsidized-result/subsidized-result-search/subsidized-result-search.component';
import { ImportSubsidizedComponent } from './subsidized-info/subsidized-info-form/file-import-subsidized-management/import-subsidized.component';
import { ImportSubsidizedApproveComponent } from './subsidized-info-approve/file-import-subsidized-approve/import-subsidized-approve.component';

@NgModule({
  declarations: [
    SubsidizedPeriodIndexComponent,
    SubsidizedPeriodSearchComponent,
    SubsidizedPeriodFormComponent,
    SubsidizedInfoIndexComponent,
    SubsidizedInfoSearchComponent,
    SubsidizedInfoFormComponent,
    ImportSubsidizedComponent,
    SubsidizedInfoApproveIndexComponent,
    SubsidizedInfoApproveSearchComponent,
    SubsidizedInfoApproveFormComponent,
    SubsidizedResultIndexComponent,
    SubsidizedResultSearchComponent,
    ImportSubsidizedApproveComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    SubsidizedRoutingModule
  ],
  exports: [
  ],
  entryComponents: [
    ImportSubsidizedComponent,
    ImportSubsidizedApproveComponent
  ]
})
export class SubsidizedModule {
}
