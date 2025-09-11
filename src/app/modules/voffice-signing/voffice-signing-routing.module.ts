import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VofficeSigningFormComponent } from './form/voffice-signing-form.component';

const routes: Routes = [
  {
    path: ':signType/:signDocumentId',
    component: VofficeSigningFormComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VofficeSigningRoutingModule {
}
