import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router} from '@angular/router';
import { FormGroup } from '@angular/forms';
import { CommonUtils, ValidationService } from '@app/shared/services';
import { RewardProposeService } from '@app/core/services/reward-propose/reward-propose.service';
import { ExamQuestionSetService } from '@app/core/services/thorough-content/exam-question-set.service';
import { AppComponent } from '@app/app.component';

@Component({
  selector: 'file-import-exam-question',
  templateUrl: './file-import-exam-question.component.html'
})
export class ExamQuestionImportComponent extends BaseComponent implements OnInit {
  formSave: FormGroup;
  examQuestionSetId: null;
  dataHistory: null;
  formConfig = {
    fileAttachments: [null, ValidationService.required],
    examQuestionSetId: [null],
  };
  public dataError: any;

  constructor(
    public activeModal: NgbActiveModal,
    private router: Router,
    public actr: ActivatedRoute,
    private app: AppComponent,
    private service: ExamQuestionSetService,
  ) {
    super(null, 'REQUEST_RESOLUTION_QUARTER_YEAR');
    this.formSave = this.buildForm({}, this.formConfig);
  }

  ngOnInit() {}

  get f() {
    return this.formSave.controls;
  }

  setInitValue(data){
    this.formSave.get('examQuestionSetId').setValue(data.examQuestionSetId);
    this.examQuestionSetId = data.examQuestionSetId;
    this.dataHistory = data;
  }

  processDownloadTemplate() {
    this.service.downloadTemplateImport().subscribe(res => {
      saveAs(res, 'import-question.xls');
    });
  }

  public processImport() {
    if (!CommonUtils.isValidForm(this.formSave)) {
      return;
    }
    console.log('test to to');
    if (this.examQuestionSetId == null){
      console.log('test tu tu');
      this.app.warningMessage('','Vui lòng lưu thông tin đề thi trước khi import câu hỏi!');
      return;
    }
    const data = {
      file: this.formSave.value['fileAttachments']
    };
    this.service.processImport(this.formSave.value).subscribe(res => {
      if (res) {
        console.log("data res", res);
        if (res.data.messages === 'error') {
          const saveFileName = 'Ket qua import.xls';
          saveAs(this.dataUriToBlob(res.data.file, 'application/xlsx'), saveFileName);
          this.app.errorMessage('error');
        } else if (res.data.messages === 'notExist') {
          this.app.errorMessage('notExist');
        } else if (res.data.messages === 'FileNotMatchType') {
          this.app.errorMessage('FileNotMatchType');
        }
        else if (res.data.messages === 'success') {
          this.app.successMessage('success');
          this.activeModal.close(res);
          this.dataError = null;
          this.router.navigateByUrl('employee/exam-question-set/create-update', { state: this.dataHistory });
        }
      }
    });
  }

  dataUriToBlob(dataUri, types) {
    const byteString = window.atob(dataUri);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: types });
    return blob;
  }
}
