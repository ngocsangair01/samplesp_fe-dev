import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArmyProposedTemplateIndexComponent } from './army-proposed-template-index/army-proposed-template-index.component';
const routes: Routes = [
  {
    path: '',
    component: ArmyProposedTemplateIndexComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArmyProposedTemplateRoutingModule {}

