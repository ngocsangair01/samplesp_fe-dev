import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared';
import { CreateWarningComponent } from './warning-manager-add/create-warning.component';
import { WarningRoutingModule } from './warning-routing.module';
import { SearchWarningComponent } from './warning-manager-search/search-warning.component';
import { WarningDynamicColumnComponent } from './warning-manager-add/form-childs/warning-dynamic-column/warning-dynamic-column.component';
 
@NgModule({
  declarations: [
    CreateWarningComponent,
    SearchWarningComponent,
    WarningDynamicColumnComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    WarningRoutingModule
  ],
  exports: [
  ]
})
export class WarningModule { }
