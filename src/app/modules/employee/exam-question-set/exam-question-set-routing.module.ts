import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExamQuestionSetAddUpdateComponent } from './exam-question-set-add-update/exam-question-set-add-update.component';
import { ModalExamQuestionComponent } from './exam-question-set-add-update/modal-exam-question.component';
import { IndexComponent } from './index/index.component';

const routes: Routes = [
  {
    path: '',
    component: IndexComponent
  },
  {
    path: 'create-update',
    component: ExamQuestionSetAddUpdateComponent
  },
  {
    path: 'view',
    component: ExamQuestionSetAddUpdateComponent
  }
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamQuestionSetRoutingModule { }
