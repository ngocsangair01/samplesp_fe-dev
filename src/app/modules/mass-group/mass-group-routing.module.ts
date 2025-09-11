import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MassGroupIndexComponent } from './mass-group-index/mass-group-index.component';

const routes: Routes = [
  {
    path: '',
    component: MassGroupIndexComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MassGroupRoutingModule { }
