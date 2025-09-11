import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { AppComponent } from '@app/app.component';
import { AssessmentResultService } from '@app/core/services/employee/assessment-result.service';
import { HrStorage } from '@app/core/services/HrStorage';
import { SignDocumentService } from '@app/core/services/sign-document/sign-document.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslationService } from 'angular-l10n';
import { ConfirmationService } from 'primeng/api';
import { AssessmentSignPreviewModalComponent } from './preview-modal-sign/assessment-sign-preview-modal.component';

@Component({
  selector: 'assessment-sign-image',
  templateUrl: './assessment-sign-image.component.html'
})
export class AssessmentSignImageComponent extends BaseComponent implements OnInit {
  formGroup: FormGroup;
  signatureImages: any[] = [];
  evaluateEmployeeData: any[] = [];
  activeSignature: any = null;
  formConfig = {
    employeeId: ['', Validators.compose([Validators.required])],
    signImageId: [null, [Validators.required]],
  };
  isToggleStyle: Boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private signDocumentService: SignDocumentService,
    private confirmationService: ConfirmationService,
    public translation: TranslationService,
    private assessmentResultService: AssessmentResultService,
    private modalService: NgbModal,
    private app: AppComponent,
  ) {
    super(null, "STAFF_ASSESSMENT");
    this.formGroup = this.buildForm({}, this.formConfig);
  }

  ngOnInit() {
  }

  get f() {
    return this.formGroup.controls;
  }

  setFormValue(data: any) {
    this.evaluateEmployeeData = data.evaluateEmployeeData
    this.signDocumentService.findNewestVofficeSignature(data.employeeId).subscribe(res => {
      let signImageId = null;
      if (res.data && res.data.length > 0) {
        this.signatureImages = res.data;
        this.signatureImages.forEach(element => {
          element.attachBytes = "data:image/png;base64," + element.attachBytes;
        });
        if (this.signatureImages.length > 0) {
          signImageId = this.signatureImages[0].staffImageSignId;
        }
      }
      this.isToggleStyle = this.signatureImages && this.signatureImages.length > 2;
      this.activeSignature = signImageId;
      this.formGroup = this.buildForm({employeeId: data.employeeId, signImageId: signImageId}, this.formConfig);
      this.formGroup.controls['signImageId'].setValue(signImageId)
    });
  }

  /**
  * choseSignImage
  */
  public choseSignImage() {
    if (!CommonUtils.isValidForm(this.formGroup)) {
      this.app.warningMessage('assessmentResult.requireSignImage');
      return;
    }
    if (this.signatureImages.length === 0) {
      this.app.warningMessage('assessmentResult.validateSignImage');
      return;
    }
    this.confirmationService.confirm({
      message: this.translation.translate('assessmentResult.confirmEvaluateEmployee'),
      accept: () => {
        this.activeModal.close(this.formGroup.value);
      },
      acceptLabel: this.translation.translate('common.button.yes'),
      rejectLabel: this.translation.translate('common.button.no'),
    });
  }

  handleSelectSign(value) {
    const staffImageSignId = value && value.staffImageSignId;
    if (staffImageSignId == this.activeSignature) {
      return;
    }
    this.activeSignature = staffImageSignId
    this.formGroup.controls['signImageId'].setValue(staffImageSignId)
  }

  preview() {
    const saveData = this.formGroup.value;
    this.evaluateEmployeeData['signImageId'] = this.activeSignature;
    this.evaluateEmployeeData['isDraft'] = true;
    this.assessmentResultService.saveOrUpdate(this.evaluateEmployeeData).subscribe(res => {
      const modalRef = this.modalService.open(AssessmentSignPreviewModalComponent, {size: 'lg',backdrop: 'static',windowClass:'dialog-preview-file modal-xxl' ,keyboard: false});
      modalRef.componentInstance.evaluateEmployeeData = this.evaluateEmployeeData;
    })
  }
}
