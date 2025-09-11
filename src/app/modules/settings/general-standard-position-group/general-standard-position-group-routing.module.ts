
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GeneralStandardPositionGroupIndexComponent } from './general-standard-position-group-index/general-standard-position-group-index.component';

const routes: Routes = [
  {
    path: '',
    component: GeneralStandardPositionGroupIndexComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeneralStandardPositionGroupRoutingModule { }
