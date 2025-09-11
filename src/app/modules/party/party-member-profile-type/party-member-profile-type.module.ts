import { PartyMemberProfileTypeSearchComponent } from './party-member-profile-type-search/party-member-profile-type-search.component';
import { PartyMemberProfileTypeIndexComponent } from './party-member-profile-type-index/party-member-profile-type-index.component';
import { SharedModule } from '@app/shared';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PartyMemberProfileTypeRoutingModule } from './party-member-profile-type-routing.module';
import { PartyMemberProfileTypeFormComponent } from './party-member-profile-type-form/party-member-profile-type-form.component';

@NgModule({
  declarations: [PartyMemberProfileTypeIndexComponent, PartyMemberProfileTypeSearchComponent, PartyMemberProfileTypeFormComponent],
  imports: [
    SharedModule,
    CommonModule,
    PartyMemberProfileTypeRoutingModule
  ]
})
export class PartyMemberProfileTypeModule { }
