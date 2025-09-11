import { FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { HrStorage } from '@app/core/services/HrStorage';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { Router } from '@angular/router';
import { AppParamService } from '@app/core/services/app-param/app-param.service';
import { AppComponent } from '@app/app.component';
import { APP_CONSTANTS } from '@app/core/app-config';
import { QuestionAndAnswerService } from '@app/core/services/party-organization/question-and-answer.service';
import { CommonUtils, ValidationService } from '@app/shared/services';

@Component({
  selector: 'question-and-answer-search',
  templateUrl: './question-and-answer-search.component.html',
})
export class QuestionAndAnswerSearchComponent extends BaseComponent implements OnInit {
  isUserAnswer: boolean = false;
  userName: string = '';
  employeeCode: string = '';
  email: string;
  questionAndAnswerStatusList = APP_CONSTANTS.QUESTION_AND_ANSWER_STATUS_LIST;
  formSearch: FormGroup;
  status: any;
  formConfig = {
    title: ['', [ValidationService.maxLength(200)]],
    status: [''],
  };
  constructor(
    private questionAndAnswerService: QuestionAndAnswerService,
    private appParamService: AppParamService,
    private router: Router,
    private app: AppComponent
  ) {
    super(null, CommonUtils.getPermissionCode("resource.questionAndAnswer"));
    this.setMainService(questionAndAnswerService);
    this.formSearch = this.buildForm({}, this.formConfig);
    this.processSearch();
    this.appParamService.appParams('USERS_ANSWER').subscribe(res => {
      if (res == null) {
        return
      }
      const userAnswer = res.data[0].parValue;
      if (userAnswer != null) {
        const userToken = HrStorage.getUserToken();
        this.userName = userToken['userName'];
        this.employeeCode = userToken['employeeCode'];
        this.email = userToken['email'];
        const users = userAnswer.split(",");
        users.forEach(user => {
          if (this.userName === user || this.email === (user + '@sangnn.com.vn')) {
            this.isUserAnswer = true;
          }
        });
      }
    })
  }

  ngOnInit() {

  }

  get f() {
    return this.formSearch.controls;
  }

  public prepareSaveOrUpdate(item?: any) {
    if (item && item.questionAndAnswerId > 0) {
      this.questionAndAnswerService.findOne(item.questionAndAnswerId).subscribe(res => {
        if (this.questionAndAnswerService.requestIsSuccess(res)) {
          if (res.data.status == 0) {
            this.router.navigate(['/party-organization/question-and-answer-edit', item.questionAndAnswerId]);
          } else {
            this.app.warningMessage('questionHasAnswered');
          }
        }
      });
    } else {
      this.router.navigate(['/party-organization/question-and-answer-add']);
    }
  }

  public prepareView(item?: any) {
    if (item && item.questionAndAnswerId > 0) {
      this.questionAndAnswerService.findOne(item.questionAndAnswerId).subscribe(res => {
        if (this.questionAndAnswerService.requestIsSuccess(res)) {
          this.router.navigate(['/party-organization/question-and-answer-view', item.questionAndAnswerId]);
        }
      });
    }
  }

  public answerTheQuestion(item?: any) {
    if (item && item.questionAndAnswerId > 0) {
      this.questionAndAnswerService.findOne(item.questionAndAnswerId).subscribe(res => {
        if (this.questionAndAnswerService.requestIsSuccess(res)) {
          this.router.navigate(['/party-organization/answer-question', item.questionAndAnswerId]);
        }
      });
    }
  }

  processDelete(item) {
    if (item && item.questionAndAnswerId > 0) {
      this.app.confirmDelete("deleteQuestionAndAnswer", () => {// on accepted
        this.questionAndAnswerService.deleteById(item.questionAndAnswerId)
          .subscribe(res => {
            if (this.questionAndAnswerService.requestIsSuccess(res)) {
              this.processSearch(null);
            }
          });
      }, () => {// on rejected
      });
    }
  }
}