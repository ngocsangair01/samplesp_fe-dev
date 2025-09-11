import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared';
import { ConfigArmyConditionRoutingModule } from './config-army-condition-routing.module';
import { ConfigArmyConditionAddComponent } from './config-army-condition-add/config-army-condition-add.component';
import { ConfigArmyConditionIndexComponent } from './config-army-condition-index/config-army-condition-index.component';
import { ConfigArmyConditionSearchComponent } from './config-army-condition-search/config-army-condition-search.component';


@NgModule({
  declarations: [
    ConfigArmyConditionSearchComponent,
    ConfigArmyConditionIndexComponent,
    ConfigArmyConditionAddComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    ConfigArmyConditionRoutingModule
  ],
  entryComponents: [ConfigArmyConditionAddComponent]
})
export class ConfigArmyConditionModule { }
