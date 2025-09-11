import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfigArmyConditionIndexComponent } from './config-army-condition-index/config-army-condition-index.component';
const routes: Routes = [
  {
    path: '',
    component: ConfigArmyConditionIndexComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigArmyConditionRoutingModule {}

