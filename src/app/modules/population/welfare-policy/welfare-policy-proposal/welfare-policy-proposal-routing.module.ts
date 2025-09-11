import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  WelfarePolicyProposalComponent
} from "@app/modules/population/welfare-policy/welfare-policy-proposal/welfare-policy-proposal-index/welfare-policy-proposal-index.component";
import {
  WelfarePolicyProposalFormComponent
} from "@app/modules/population/welfare-policy/welfare-policy-proposal/welfare-policy-proposal-form/welfare-policy-proposal-form.component";

const routes: Routes = [
  {
    path: '',
    component: WelfarePolicyProposalComponent
  },
  {
    path: 'create',
    component: WelfarePolicyProposalFormComponent
  },
  {
    path: 'update/:id',
    component: WelfarePolicyProposalFormComponent
  },
  {
    path: 'view/:id',
    component: WelfarePolicyProposalFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WelfarePolicyProposalRoutingModule { }
