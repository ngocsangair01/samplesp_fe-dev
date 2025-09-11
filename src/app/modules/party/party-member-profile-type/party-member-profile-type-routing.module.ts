import { PartyMemberProfileTypeSearchComponent } from './party-member-profile-type-search/party-member-profile-type-search.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PartyMemberProfileTypeFormComponent } from './party-member-profile-type-form/party-member-profile-type-form.component';

const routes: Routes = [
  {
    path: '',
    component: PartyMemberProfileTypeSearchComponent,
  }, {
    path: 'add',
    component: PartyMemberProfileTypeFormComponent,
  },
  {
    path: 'edit/:id',
    component: PartyMemberProfileTypeFormComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartyMemberProfileTypeRoutingModule { }
