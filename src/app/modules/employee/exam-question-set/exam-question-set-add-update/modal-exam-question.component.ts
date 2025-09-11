import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, RESOURCE } from '@app/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslationService } from 'angular-l10n';

@Component({
  selector: 'modal-exam-question',
  templateUrl: './modal-exam-question.component.html',
  styleUrls: ['./modal-exam-question.component.css']
})
export class ModalExamQuestionComponent extends BaseComponent implements OnInit {
  formSave: FormGroup;
  answer: FormArray;
  isView: boolean = false;
  parrentView: boolean = false;
  mode: string;

  formConfig = {
    examQuestionId: [null],
    examQuestionSetId: [null],
    question: [null, [Validators.required]],
    type: [{ id: 1, name: this.translateService.translate('label.exam.question.type-1') }],
    status: [{ id: 1, name: this.translateService.translate('label.exam.question.status-1') }],
    typeName: [null],
    statusName: [null],
    answersName: [null],
    isCorrectName: [null],
    examQuestionAnswerBeanList: [null],
  };

  formQuestionConfig = {
    answer: [null],
    isTrue: [false],
  };

  riskControlLibraryList = [];
  oldTypeOfManager = null;
  questionTypeList = [
    { id: 1, name: this.translateService.translate('label.exam.question.type-1') },
    { id: 2, name: this.translateService.translate('label.exam.question.type-2') }
  ];

  statusList = [
    { id: 1, name: this.translateService.translate('label.exam.question.status-1') },
    { id: 2, name: this.translateService.translate('label.exam.question.status-2') }
  ];

  constructor(
    public actr: ActivatedRoute,
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private app: AppComponent,
    private translateService: TranslationService
  ) {
    super();
    this.formSave = this.formBuilder.group({
      ...this.formConfig,
      answers: this.formBuilder.array([])
    });


    this.formSave.get('answers').valueChanges.subscribe(value => {
      console.log(value);
    })
  }

  ngOnInit() {
  }

  get formControls() {
    return this.formSave.controls;
  }

  isFieldValid(field: string) {
    if (this.formSave != undefined) {
      return !this.formSave.get(field).valid && this.formSave.get(field).touched;
    }
  }
  checkValidate(name: string) {
    return this.formSave.get(name).invalid && (this.formSave.get(name).dirty || this.formSave.get(name).touched);
  }

  cloneFormGroup(formGroup: FormGroup): FormGroup {
    const copiedControls = {};
    Object.keys(formGroup.controls).forEach(controlName => {
      const control = formGroup.controls[controlName];
      copiedControls[controlName] = new FormControl(control.value);
    });
    return new FormGroup(copiedControls);
  }

  updateModal() {
    this.isView = false;
  }

  setValueToField(item, data) {
    this.formSave.get(item).setValue(data);
  }

  

  onCloseAddModal() {
    if (this.formSave.dirty) {
      this.app.confirmMessage('app.qlqt.process_tool.add-exist', () => {
        this.activeModal.close();
      }, () => {
      });
    }
    else {
      this.activeModal.close();
    }
  }

  setInitValue(mode, data?: { form }) {
    this.mode = mode;
    if (mode == 'insert') {
      this.addAnswer();
    } else if (mode == 'update') {
      console.log('data formSave', data);
      this.buildFormExamQuestion(data.form.value);
      // this.setAnswers(data.form.value.answers);
      this.setAnswers(data.form.value.answers);
      // this.formSave = data.form;
      console.log('data formSave 1', this.formSave);
      this.initUpdate();
      // this.partCatalog.setValueDefault(this.formSave.get('partCatalogName').value);
      // this.formSave.reset(this.formSave.value);
    } else {
      this.isView = true;
      this.buildFormExamQuestion(data.form.value);
      // this.setAnswers(data.form.value.answers);
      this.setAnswers(data.form.value.answers);
      // this.formSave = data.form;
      console.log('data formSave 1', this.formSave);
      this.initUpdate();
    }
  }

  saveInfor() {
    if(this.formSave.value.answers != undefined){
      console.log("check 1", this.formSave);
      let count = this.formSave.value.answers.filter(item => item.isTrue === true).length;
      if(count < 1){
        console.log("check 2", this.formSave);
        this.app.warningMessage('','Vui lòng chọn đáp án đúng !');
        return;
      } else {
        console.log("check 3", this.formSave);
        if(this.formSave.value.type.id == 1 && count > 1){
          this.app.warningMessage('','Chỉ được chọn một đáp án đúng cho câu hỏi thuộc loại 1 đáp án!');
          return;
        }
      }
    }else{
      console.log("check 4", this.formSave);
      this.app.warningMessage('','Vui lòng chọn một đáp án !');
    }

    if (CommonUtils.isValidForm(this.formSave)) {
      const copiedForm = this.cloneFormGroup(this.formSave);
      console.log(this.formSave)
      copiedForm.controls['type'].setValue(this.formSave.value.type == undefined ? null : this.formSave.value.type.id);
      copiedForm.controls['status'].setValue(this.formSave.value.status == undefined ? null : this.formSave.value.status.id);
      copiedForm.controls['typeName'].setValue(this.formSave.value.type == undefined ? null : this.formSave.value.type.name);
      copiedForm.controls['statusName'].setValue(this.formSave.value.status == undefined ? null : this.formSave.value.status.name);
      copiedForm.controls['answersName'].setValue(this.getFormattedAnswers());
      copiedForm.controls['isCorrectName'].setValue(this.getFormattedCorrect());
      copiedForm.controls['answers'].setValue(this.formSave.value.answers == undefined ? null : this.formSave.value.answers);
      copiedForm.controls['examQuestionAnswerBeanList'].setValue(this.formSave.value.answers == undefined ? null : this.formSave.value.answers);
      //examQuestionAnswerBeanList

      console.log(copiedForm.getRawValue());

      this.activeModal.close(copiedForm.getRawValue());
    } else {
      // this.app.warningMessage('app.qlkt.medicine.create.required');
      return;
    }
  }

  buildFormExamQuestion(data) {
    this.formSave = this.formBuilder.group({
        examQuestionId: [data.examQuestionId],
        // Hồ sơ rủi ro
        question: [data.question],
        type: [data.type],
        status: [data.status],
        answers: this.formBuilder.array([]),
        typeName: [null],
        statusName: [null],
        answersName: [null],
        isCorrectName: [null],
        examQuestionAnswerBeanList: [null],
    });
  }

  initUpdate(){
    this.formSave.get('type').reset(this.getSelectedItem(this.questionTypeList, 'id', this.formSave.get('type').value));
    this.formSave.get('status').reset(this.getSelectedItem(this.statusList, 'id', this.formSave.get('status').value));
  }

  getFormattedAnswers(): string {
    return this.answers.controls
      .map((answerItem, index) => {
        const answer = answerItem.get('answer').value;
        const letter = String.fromCharCode(65 + index);
        return `${letter}. ${answer}`;
      })
      .join('\n');
  }

  getFormattedCorrect(): string {
    return this.answers.controls
      .map((answerItem, index) => {
        const answer = answerItem.get('answer').value;
        const letter = String.fromCharCode(65 + index);
        return answerItem.get('isTrue').value ? `${letter}` : '';
      })
      .filter((answerItem) => answerItem !== '')
      .join(', ');
  }

  get answers(): FormArray {
    return this.formSave.get('answers') as FormArray;
  }

  addAnswer() {
    const answer = this.formBuilder.group({
      answer: ['', [Validators.required]],
      isTrue: [false]
    });
    this.answers.push(answer);
  }

  removeAnswer(index: number): void {
    this.answers.removeAt(index);
  }

  getSelectedItem(items, key, value) {
    if (value != undefined && value != null && items != null && items != undefined ) {
      for (let i = 0; i < items.length; i++) {
        if (value == items[i][key]) {
          return items[i];
        }
      }
    } else {
      return null;
    }
  }

  setAnswers(data: any[]): void {
    const answerArray = this.formSave.get('answers') as FormArray;

    if (!answerArray) {
      console.error('answers FormArray is not found in formSave');
      return;
    }
  
    data.forEach(item => {
      const answerGroup = this.formBuilder.group({
        answer: [item.answer],        // Lấy trường 'answer'
        examQuestionAnswerId: [item.examQuestionAnswerId],
        isTrue: [item.isTrue === 1 || item.isTrue === true]   // Chuyển 0/1 thành true/false
      });
      answerArray.push(answerGroup); // Thêm từng phần tử mới
    });
  }

  get f() {
    return this.formSave.controls;
  }

  getfA(data){
    const answerGroup = this.answers.at(data) as FormGroup;
    return answerGroup.controls;
  }
}
