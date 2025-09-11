import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { SignComponent } from './sign/sign.component';
import { SignIndexComponent } from './sign-index/sign-index.component';
import { MultipleSignComponent } from './multiple-sign/multiple-sign';
const routes: Routes = [
  {
    path: ':signType/:signDocumentId',
    component: SignIndexComponent
  },
  {
    path: 'multiple-sign',
    component: MultipleSignComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SignRoutingModule {
}
