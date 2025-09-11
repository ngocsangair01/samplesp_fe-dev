import { SharedModule } from '@app/shared';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MassGroupRoutingModule } from './mass-group-routing.module';
import { MassGroupIndexComponent } from './mass-group-index/mass-group-index.component';
import { MassGroupSearchComponent } from './mass-group-search/mass-group-search.component';
import { MassGroupFormComponent } from './mass-group-form/mass-group-form.component';
import { MassGroupImportComponent } from './mass-group-import/mass-group-import.component';
import { ToastModule } from 'primeng/toast';

@NgModule({
  declarations: [MassGroupIndexComponent, MassGroupSearchComponent, MassGroupFormComponent, MassGroupImportComponent],
  imports: [
    CommonModule,
    MassGroupRoutingModule,
    SharedModule,
    ToastModule
  ],
  entryComponents: [
    MassGroupFormComponent,
    MassGroupImportComponent
  ]
})
export class MassGroupModule { }
