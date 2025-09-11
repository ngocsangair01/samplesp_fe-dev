import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmpArmyProposedIndexComponent } from './emp-army-proposed-index/emp-army-proposed-index.component';
import { EmpArmyProposedSystemIndexComponent } from './emp-army-proposed-system-index/emp-army-proposed-system-index.component';
const routes: Routes = [
  {
    path: '',
    component: EmpArmyProposedIndexComponent,
  },
  {
    path: 'system',
    component: EmpArmyProposedSystemIndexComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmpArmyProposedRoutingModule {}

