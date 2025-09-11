import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';
import { CommonModule } from '@angular/common';
import { ManagementVerticalRoutingModule } from './management-vertical-routing.module';
import { ManagementVerticalIndexComponent } from './management-vertical-index/management-vertical-index.component';
import { ManagementVerticalSearchComponent } from './management-vertical-search/management-vertical-search.component';
import { ManagementVerticalImportComponent } from './management-vertical-import/management-vertical-import.component';
import { ManagementVerticalFormComponent } from './management-vertical-form/management-vertical-form.component';

@NgModule({
  declarations: [
    ManagementVerticalIndexComponent,
    ManagementVerticalSearchComponent,
    ManagementVerticalImportComponent,
    ManagementVerticalFormComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    ManagementVerticalRoutingModule
  ]
})
export class ManagementVerticalModule { }
