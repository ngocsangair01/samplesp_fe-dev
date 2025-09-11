import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AppComponent } from '@app/app.component';
import { ACTION_FORM, RESOURCE } from '@app/core';
import { TaskService } from '@app/core/services/thorough-content/task.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslationService } from 'angular-l10n';

@Component({
  selector: 'update-progress',
  templateUrl: './update-progress.component.html'
})
export class UpdateProgressCompoment extends BaseComponent implements OnInit {
  formSave: FormGroup;
  answer: FormArray;
  isView: boolean = false;
  isdisable: boolean = false;
  viewMode: boolean = false;
  parrentView: boolean = false;
  mode: string;

  formConfig = {
    taskId: [null],
    taskProgressId: [null],
    progress: [null, [Validators.required]],
    status: [{ id: 1, name: this.translateService.translate('label.thorough-content.update-progress.status-1') }, [Validators.required]],
    note: [null],
  };

  formQuestionConfig = {
    answer: [null],
    isTrue: [false],
  };

  riskControlLibraryList = [];
  oldTypeOfManager = null;

  statusList = [
    { id: 1, name: this.translateService.translate('label.thorough-content.update-progress.status-1') },
    { id: 2, name: this.translateService.translate('label.thorough-content.update-progress.status-2') }
  ];

  get names(): FormArray {
    return this.formSave.get('names') as FormArray;
  }

  constructor(
    public actr: ActivatedRoute,
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private app: AppComponent,
    private service: TaskService,
    private translateService: TranslationService
  ) {
    super();
    this.formSave = this.formBuilder.group({
      ...this.formConfig,
      names: this.formBuilder.array([])
    });
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

  setInitValue(mode, data) {
    this.mode = mode;
    if (mode == 'insert') {
      console.log('thong tin data', data);
      // this.service.findOne(data.taskId).subscribe(res => {
      //   this.buildFormSave(res.data)
      //   this.setNames(res.data.names);
      // })
      this.service.findProgress(data.taskId).subscribe(res => {
        this.buildFormUpdate(res.data)
        this.setNames(res.data.names);
        this.initUpdate();
      })
      
    } else if (mode == 'update') {
      console.log('data formSave', data);
      this.service.findProgress(data.taskId).subscribe(res => {
        this.buildFormUpdate(res.data)
        this.setNames(res.data.names);
        this.initUpdate();
      })
      
    } else {
      this.isView = true;
      this.buildFormUpdate(data.form.value);
      // this.formSave = data.form;
      console.log('data formSave 1', this.formSave);
      this.initUpdate();
    }
  }

  saveInfor() {

    if (CommonUtils.isValidForm(this.formSave)) {
      const copiedForm = this.cloneFormGroup(this.formSave);
      console.log(this.formSave)
      copiedForm.controls['status'].setValue(this.formSave.value.status == undefined ? null : this.formSave.value.status.id);
      console.log(copiedForm.getRawValue());
      
      // Lưu lại
      this.app.confirmMessage(null,
        () => {
          this.service.saveUpdateProgress(copiedForm.value)
            .subscribe(res => {
              if (res.code == "success") {
                this.activeModal.close(copiedForm.getRawValue());
              }
            });
        },
        () => {
        }
      )
      // this.activeModal.close(copiedForm.getRawValue());
    } else {
      // this.app.warningMessage('app.qlkt.medicine.create.required');
      return;
    }
  }

  buildFormSave(data) {
    this.formSave = this.formBuilder.group({
      taskId: [data.taskId],
      taskProgressId: [null],
      progress: [null, [Validators.required]],
      status: [null, [Validators.required]],
      note: [null],
      names: this.formBuilder.array([]),
    });
  }

  buildFormUpdate(data) {
    this.formSave = this.formBuilder.group({
      taskId: [data.taskId],
      taskProgressId: [data.taskProgressId],
      status: [{ id: 1, name: this.translateService.translate('label.thorough-content.update-progress.status-1') }, [Validators.required]],
      progress: [data.progress, [Validators.required]],
      note: [data.note],
      names: this.formBuilder.array([]),
    });
  }

  initUpdate(){
    // this.formSave.get('status').reset(this.getSelectedItem(this.statusList, 'id', this.formSave.get('status').value));
  }


  addChecklist() {
    const name = this.formBuilder.group({
      name: ['', [Validators.required]],
      isTrue: [false]
    });
    this.names.push(name);
  }

  removeChecklist(index: number): void {
    this.names.removeAt(index);
  }

  setNames(data: any[]): void {
    const answerArray = this.formSave.get('names') as FormArray;
  
    data.forEach(item => {
      const answerGroup = this.formBuilder.group({
        name: [item.name],        // Lấy trường 'answer'
        taskChecklistId: [item.checklistId],
        isTrue: [item.status === 1 || item.status === true]   // Chuyển 0/1 thành true/false
      });
      answerArray.push(answerGroup); // Thêm từng phần tử mới
    });
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


  get f() {
    return this.formSave.controls;
  }

  checkProgress() {
    if (!this.formSave.value['progress']) {
      return false;
    }
    const progress = this.formSave.value['progress'];
    let isCheck = true;
    if(progress < 0 || progress > 100){
      isCheck = false
      this.setValueToField("progress",null);
    }
    if(progress == 100){
      this.formSave.get('status').reset(this.getSelectedItem(this.statusList, 'id', 2));
    }
    return !isCheck;
  }

  progressChange(value: any): void {
    if (value == 100) {
      this.formSave.get('status').reset(this.getSelectedItem(this.statusList, 'id', 2));
    }
  }

  statusChange(value: any): void {
    if (value != undefined && value.id == this.statusList[1].id) {
      this.formSave.get('progress').reset(100);
      this.isdisable = true;
    }
  }


}
