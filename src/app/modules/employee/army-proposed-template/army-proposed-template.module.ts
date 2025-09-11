import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared';
import { ArmyProposedTemplateRoutingModule } from './army-proposed-template-routing.module';
import { ArmyProposedTemplateAddComponent } from './army-proposed-template-add/army-proposed-template-add.component';
import { ArmyProposedTemplateIndexComponent } from './army-proposed-template-index/army-proposed-template-index.component';
import { ArmyProposedTemplateSearchComponent } from './army-proposed-template-search/army-proposed-template-search.component';


@NgModule({
  declarations: [
    ArmyProposedTemplateSearchComponent,
    ArmyProposedTemplateIndexComponent,
    ArmyProposedTemplateAddComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    ArmyProposedTemplateRoutingModule
  ],
  entryComponents: [ArmyProposedTemplateAddComponent]
})
export class ArmyProposedTemplateModule { }
