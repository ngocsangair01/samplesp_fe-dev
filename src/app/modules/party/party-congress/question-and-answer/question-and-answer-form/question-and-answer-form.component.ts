import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { ACTION_FORM, APP_CONSTANTS } from '@app/core/app-config';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { CommonUtils } from '@app/shared/services/common-utils.service';
import { ValidationService } from '@app/shared/services/validation.service';
import { AppComponent } from '@app/app.component';
import { QuestionAndAnswerService } from '@app/core/services/party-organization/question-and-answer.service';

@Component({
  selector: 'question-and-answer-form',
  templateUrl: './question-and-answer-form.component.html',
})
export class QuestionAndAnswerFormComponent extends BaseComponent implements OnInit {
  formSave: FormGroup;
  questionAndAnswerId: any;
  branchList: any;
  isUpdate: boolean = false;
  isInsert: boolean = false;
  isAnswer: boolean = false;
  isView: boolean = false;
  formConfig = {
    questionAndAnswerId: [''],
    email: [''],
    mobileNumber: [''],
    title: ['', [ValidationService.required, ValidationService.maxLength(200)]],
    question: ['', [ValidationService.required, ValidationService.maxLength(10000)]],
    answer: ['', [ValidationService.maxLength(10000)]],
  };

  constructor(
    private questionAndAnswerService: QuestionAndAnswerService,
    public actr: ActivatedRoute,
    private router: Router,
    private app: AppComponent) {
    super(null, CommonUtils.getPermissionCode("resource.document"));
    this.setFormValue({});
    this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        const params = this.actr.snapshot.params;
        if (params) {
          this.questionAndAnswerId = params.id;
        }
      }
    });
    this.branchList = APP_CONSTANTS.NOTIFYBRANCHLIST;
  }

  ngOnInit() {
    const subPaths = this.router.url.split('/');
    if (subPaths.length > 2) {
      this.isUpdate = subPaths[2] === 'question-and-answer-edit';
      this.isInsert = subPaths[2] === 'question-and-answer-add';
      this.isView = subPaths[2] === 'question-and-answer-view';
      this.isAnswer = subPaths[2] === 'answer-question';
      if (this.isAnswer) {
        this.formSave.removeControl('answer');
        const answer = new FormControl('', [ValidationService.required, ValidationService.maxLength(10000)]);
        this.formSave.addControl('answer', answer);
      }
    }
    this.setFormValue(this.questionAndAnswerId);
  }

  get f() {
    return this.formSave.controls;
  }

  /**
   * buildForm
   */
  private buildForms(data?: any): void {
    this.formSave = this.buildForm(data, this.formConfig, ACTION_FORM.INSERT, []);
  }

  /**
   * setFormValue
   * param data
   */
  public setFormValue(data?: any) {
    this.buildForms({});
    if (data && data > 0) {
      this.questionAndAnswerService.findOne(data)
        .subscribe(res => {
          this.buildForms(res.data);
        })
    }
  }

  public processSaveOrUpdate() {
    if (!CommonUtils.isValidForm(this.formSave)) {
      return;
    }
    if (this.isAnswer) {
      this.app.confirmMessage(null, () => { // on accepted
        this.questionAndAnswerService.answerQuestion(this.formSave.value)
          .subscribe(res => {
            if (this.questionAndAnswerService.requestIsSuccess(res)) {
              this.goBack();
            }
          });
      }, () => {
        // on rejected
      });
    } else {
      this.app.confirmMessage(null, () => { // on accepted
        this.questionAndAnswerService.saveOrUpdate(this.formSave.value)
          .subscribe(res => {
            if (this.questionAndAnswerService.requestIsSuccess(res)) {
              this.goBack();
            }
          });
      }, () => {
        // on rejected   
      });
    }
  }

  public goBack() {
    this.router.navigate(['/party-organization/question-and-answer']);
  }
}