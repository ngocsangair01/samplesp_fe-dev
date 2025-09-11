import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppComponent } from '@app/app.component';
import { AssessmentResultService } from '@app/core/services/employee/assessment-result.service';
import { BaseComponent } from '@app/shared/components/base-component/base-component.component';
import { CommonUtils } from '@app/shared/services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { $ } from 'protractor';

@Component({
  selector: 'assessment-signature',
  templateUrl: './assessment-signature.component.html',
  styleUrls: ['./assessment-signature.component.css']
})
export class AssessmentSignatureComponent extends BaseComponent implements OnInit {

  formGroup: FormGroup;
  formSigner: FormArray;
  assessmentResultId: any;
  lstVofficeUser: any[] = [];
  formConfig = {
    vofficeUser: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
    vofficePassword: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
  }
  formSignerConfig = {
    assessmentLevelId: [''],
    assessmentLevelName: [''],
    employeeId: [''],
    employeeFullName: [''],
    displaySignImage: [''],
    email: [''],
    vof2EntityUser: [[]],
    userVofficeId: ['', [Validators.required]],
    signatureImages: [[]],
    signImageId: [''] 
  }
  constructor(
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private assessmentResultService: AssessmentResultService,
    private app: AppComponent,
  ) {
    super(null, "STAFF_ASSESSMENT");
    this.formGroup = this.buildForm({}, this.formConfig);
    this.buildFormSigner(null);
  }

  ngOnInit() {
  }

  get f() {
    return this.formGroup.controls;
  }

  /**
   * buildFormSigner
   */
  private buildFormSigner(listSigner: any) {
    if (!listSigner) {
      listSigner = [{}];
    }
    const controls = new FormArray([]);
    for (const signer of listSigner) {
      const group = this.makeDefaultSignerForm();
      group.patchValue(signer);
      controls.push(group);
    }
    this.formSigner = controls;
  }
  /**
   * makeDefaultSignerForm
   */
  private makeDefaultSignerForm(): FormGroup {
    const formGroup = this.buildForm({}, this.formSignerConfig);
    return formGroup;
  }
  setFormValue(assessmentResultId: any, assessmentPeriodId: any, employeeId: any) {
    this.assessmentResultId = assessmentResultId;
    const formRequest = {
      assessmentPeriodId: assessmentPeriodId,
      employeeId: employeeId
    };

    this.assessmentResultService.getListSigned(formRequest).subscribe(res => {
      const listSigner = res.data;

      if (listSigner) {
        listSigner.forEach(items => {
          const listVofficeUser = [];
          items.vof2EntityUser.forEach(item => {
            const lstVofficeUser = {
              value: item.adOrgId + '-' + item.userId + '-' + item.sysRoleId,
              label: item.jobTile + ' - ' + item.adOrgName
            };
            listVofficeUser.push(lstVofficeUser);
          });
          
          items.vof2EntityUser = listVofficeUser;

          if (listVofficeUser && listVofficeUser.length > 0) {
            items.userVofficeId = listVofficeUser[0].value;
          }

          if (items.signatureImages && items.signatureImages.length > 0) {
            items.signatureImages.forEach(element => {
              element.attachBytes = "data:image/png;base64," + element.attachBytes;
            });
            items.signImageId = items.signatureImages[0].staffImageSignId;
          }
        });
      }

      this.buildFormSigner(listSigner);
    })
  }
  /**
   * validateBeforeSave
   */
  private validateBeforeSave(): boolean {
    const formGroup = CommonUtils.isValidForm(this.formGroup);
    const formSigner = CommonUtils.isValidForm(this.formSigner);
    return formGroup && formSigner;
  }
  /**
  * onSignature
  */
  public onSigned() {
    if (!this.validateBeforeSave()) {
      return;
    }
    this.app.confirmMessage('common.message.confirm.sign', () => {// on accepted 
      const formSave = this.formGroup.value;
      formSave['listSigner'] = this.formSigner.value;
      formSave['assessmentResultId'] = this.assessmentResultId;
      this.assessmentResultService.saveSignature(formSave)
        .subscribe(res => {
          if (this.assessmentResultService.requestIsSuccess(res)) {
            this.activeModal.close();
          }
        })
    }, () => {
      // on rejected
    });
  }
}
