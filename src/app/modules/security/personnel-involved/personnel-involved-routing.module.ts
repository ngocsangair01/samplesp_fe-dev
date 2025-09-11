import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PersonnelInvolvedIndexComponent } from './personnel-involved-index/personnel-involved-index.component';
import { PersonnelInvolvedImportComponent } from './personnel-involved-import/personnel-involved-import.component';

const routes: Routes = [
  {
    path: '',
    component: PersonnelInvolvedIndexComponent,
  },
  {
    path: 'import',
    component: PersonnelInvolvedImportComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonnelInvolvedRoutingModule { }
