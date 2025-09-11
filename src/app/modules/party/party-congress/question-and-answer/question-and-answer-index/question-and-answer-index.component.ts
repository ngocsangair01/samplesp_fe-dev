import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';

@Component({
  selector: 'question-and-answer-index',
  templateUrl: './question-and-answer-index.component.html',
})
export class QuestionAndAnswerIndexComponent extends BaseComponent implements OnInit {

  constructor() {
    super(null, CommonUtils.getPermissionCode("resource.questionAndAnswer"));
  }

  ngOnInit() {
  }

}
