import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HandlePartyLetterDenunciationFormComponent } from './handle-party/form/handle-party-letter-denunciation-form.component';
import { HandlePartyLetterDenunciationIndexComponent } from './handle-party/index/handle-party-letter-denunciation-index.component';
import { ReceiveLetterDenunciationFormComponent } from './receive/form/receive-letter-denunciation-form.component';
import { ReceiveLetterDenunciationIndexComponent } from './receive/index/receive-letter-denunciation-index.component';

const routes: Routes = [
  {
    path: "receive",
    component: ReceiveLetterDenunciationIndexComponent
  },
  {
    path: "receive/view/:id",
    component: ReceiveLetterDenunciationFormComponent
  },
  {
    path: "receive/add",
    component: ReceiveLetterDenunciationFormComponent
  },
  {
    path: "receive/edit/:id",
    component: ReceiveLetterDenunciationFormComponent
  },
  {
    path: "handle-party",
    component: HandlePartyLetterDenunciationIndexComponent
  },
  {
    path: "handle-party/input/:letterDenunciationId",
    component: HandlePartyLetterDenunciationFormComponent
  },
  {
    path: "handle-party/view/:letterDenunciationId",
    component: HandlePartyLetterDenunciationFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LetterDenunciationRoutingModule { }
