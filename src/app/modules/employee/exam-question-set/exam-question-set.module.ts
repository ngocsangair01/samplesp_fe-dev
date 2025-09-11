import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';
import { ExamQuestionSetAddUpdateComponent } from './exam-question-set-add-update/exam-question-set-add-update.component';
import { IndexComponent } from './index/index.component';
import { ExamQuestionSetRoutingModule } from './exam-question-set-routing.module';
import { ModalExamQuestionComponent } from './exam-question-set-add-update/modal-exam-question.component';
import { ExamQuestionImportComponent } from './exam-question-set-add-update/file-import-exam-question/file-import-exam-question.component';


@NgModule({
  declarations: [ExamQuestionSetAddUpdateComponent, IndexComponent, ModalExamQuestionComponent, ExamQuestionImportComponent],
  imports: [
    CommonModule,
    SharedModule,
    ExamQuestionSetRoutingModule,
  ],
  entryComponents: [ModalExamQuestionComponent, ExamQuestionImportComponent]
})
export class ExamQuestionSetModule { }
